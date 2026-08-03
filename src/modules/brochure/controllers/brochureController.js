import env from "../../../config/env.js";
import Product from "../../../models/Product.js";
import Lead from "../models/Lead.js";
import OtpSession from "../models/OtpSession.js";
import {
  createBrochureJwt,
  generateSessionId,
  generateOTP,
  hashOTP,
  verifyOTPHash,
} from "../services/brochureService.js";
import { validateBrochureSession } from "../middleware/requireBrochureSession.js";
import {
  validateDownloadParams,
  validateRequestOtpBody,
  validateResendOtpBody,
  validateVerifyOtpBody,
} from "../validators/requestOtpValidator.js";

const MAX_RESEND_REQUESTS = 3;
const RESEND_WINDOW_MINUTES = 15;

const getOtpExpiresAt = () =>
  new Date(Date.now() + env.brochureOtpExpiryMinutes * 60 * 1000);

const getSessionExpiresAt = () =>
  new Date(Date.now() + env.brochureSessionMaxAgeMs);

const deleteExpiredSessions = () => {
  const now = new Date();

  return OtpSession.deleteMany({
    $or: [
      { cleanupAt: { $lte: now } },
      { verified: false, expiresAt: { $lte: now } },
      {
        verified: true,
        cleanupAt: { $exists: false },
        expiresAt: { $lte: now },
      },
    ],
  });
};

const setBrochureSessionCookie = (res, jwt) => {
  res.cookie(env.brochureSessionCookieName, jwt, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: env.brochureSessionMaxAgeMs,
  });
};

const logDevelopmentOtp = ({ lead, otp, expiresAt }) => {
  if (env.isProduction) {
    return;
  }

  console.log(`
====================================================

BROCHURE OTP

Lead: ${lead.firstName} ${lead.lastName}
Product: ${lead.productName}
Email: ${lead.email}
Mobile: ${lead.mobileNumber}

OTP: ${otp}

Expires: ${expiresAt.toISOString()}

====================================================
`);
};

const findLatestSessionByMobileNumber = async (mobileNumber) => {
  const leads = await Lead.find({ mobileNumber }).select("_id").lean();

  if (!leads.length) {
    return null;
  }

  return OtpSession.findOne({
    leadId: { $in: leads.map((lead) => lead._id) },
  })
    .sort({ createdAt: -1 })
    .populate("leadId");
};

const getResendState = (session) => {
  const now = new Date();
  const windowStartedAt = session.resendWindowStartedAt;
  const windowExpiresAt = windowStartedAt
    ? new Date(windowStartedAt.getTime() + RESEND_WINDOW_MINUTES * 60 * 1000)
    : null;

  if (!windowStartedAt || windowExpiresAt <= now) {
    return {
      resendCount: 1,
      resendWindowStartedAt: now,
    };
  }

  return {
    resendCount: session.resendCount + 1,
    resendWindowStartedAt: windowStartedAt,
  };
};

export const requestOtp = async (req, res) => {
  await deleteExpiredSessions();

  const { data, error } = validateRequestOtpBody(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      field: error.field,
    });
  }

  const lead = await Lead.findOneAndUpdate(
    {
      email: data.email,
      mobileNumber: data.mobileNumber,
      productId: data.productId,
    },
    {
      ...data,
      status: "otp_requested",
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);
  const expiresAt = getOtpExpiresAt();

  await OtpSession.deleteMany({
    leadId: lead._id,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  await OtpSession.create({
    leadId: lead._id,
    otpHash,
    expiresAt,
    attempts: 0,
    verified: false,
    cleanupAt: expiresAt,
  });

  logDevelopmentOtp({ lead, otp, expiresAt });

  return res.status(201).json({
    success: true,
    message: "OTP generated successfully",
    expiresAt,
  });
};

export const verifyOtp = async (req, res) => {
  const { data, error } = validateVerifyOtpBody(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      field: error.field,
    });
  }

  const session = await findLatestSessionByMobileNumber(data.mobileNumber);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: "OTP session not found",
    });
  }

  if (session.expiresAt <= new Date()) {
    await OtpSession.deleteOne({ _id: session._id });

    return res.status(401).json({
      success: false,
      message: "OTP session expired",
    });
  }

  if (session.verified) {
    return res.status(403).json({
      success: false,
      message: "OTP session already verified",
    });
  }

  if (session.attempts >= env.brochureOtpMaxAttempts) {
    return res.status(429).json({
      success: false,
      message: "Maximum OTP attempts exceeded",
    });
  }

  const isValidOtp = await verifyOTPHash(data.otp, session.otpHash);

  if (!isValidOtp) {
    session.attempts += 1;
    session.cleanupAt = session.cleanupAt || session.expiresAt;
    await session.save();

    return res.status(401).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  const verifiedAt = new Date();
  const sessionId = generateSessionId();
  const sessionExpiresAt = getSessionExpiresAt();
  const jwt = createBrochureJwt({
    leadId: session.leadId._id,
    sessionId,
    expiresAt: sessionExpiresAt,
  });

  session.verified = true;
  session.verifiedAt = verifiedAt;
  session.sessionId = sessionId;
  session.sessionExpiresAt = sessionExpiresAt;
  session.cleanupAt = sessionExpiresAt;
  session.lastVerificationIp = req.ip || "";
  session.lastVerificationUserAgent = req.get("User-Agent") || "";
  await session.save();

  await Lead.updateOne(
    { _id: session.leadId._id },
    {
      status: "otp_verified",
      verifiedAt,
    },
  );

  setBrochureSessionCookie(res, jwt);

  return res.status(200).json({
    success: true,
    message: "Verification successful",
  });
};

export const resendOtp = async (req, res) => {
  const { data, error } = validateResendOtpBody(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      field: error.field,
    });
  }

  const session = await findLatestSessionByMobileNumber(data.mobileNumber);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: "OTP session not found",
    });
  }

  if (session.expiresAt <= new Date()) {
    await OtpSession.deleteOne({ _id: session._id });

    return res.status(401).json({
      success: false,
      message: "OTP session expired",
    });
  }

  if (session.verified) {
    return res.status(403).json({
      success: false,
      message: "OTP session already verified",
    });
  }

  const resendState = getResendState(session);

  if (resendState.resendCount > MAX_RESEND_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: "Maximum resend requests exceeded",
    });
  }

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);
  const expiresAt = getOtpExpiresAt();

  await OtpSession.deleteMany({
    leadId: session.leadId._id,
    verified: false,
  });

  await OtpSession.create({
    leadId: session.leadId._id,
    otpHash,
    expiresAt,
    attempts: 0,
    verified: false,
    cleanupAt: expiresAt,
    resendCount: resendState.resendCount,
    resendWindowStartedAt: resendState.resendWindowStartedAt,
  });

  logDevelopmentOtp({ lead: session.leadId, otp, expiresAt });

  return res.status(201).json({
    success: true,
    message: "OTP resent successfully",
    expiresAt,
  });
};

export const checkBrochureSession = async (req, res) => {
  const session = await validateBrochureSession(req, res);

  if (!session.authenticated) {
    return res.status(401).json({
      authenticated: false,
    });
  }

  return res.status(200).json({
    authenticated: true,
  });
};

export const downloadBrochure = async (req, res) => {
  const { data, error } = validateDownloadParams(req.params);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      field: error.field,
    });
  }

  const lead = req.brochureLead;
  const downloadedAt = new Date();
  const product = await Product.findOne({ slug: data.productSlug })
    .select("_id slug name")
    .lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  lead.downloadCount += 1;
  lead.status = "download_authorized";
  lead.lastDownloadedAt = downloadedAt;
  lead.downloadHistory.push({
    productId: String(product._id),
    productSlug: product.slug,
    productName: product.name,
    downloadedAt,
    sessionId: req.brochureSessionId,
    ip: req.ip || "",
    userAgent: req.get("User-Agent") || "",
  });
  await lead.save();

  return res.status(200).json({
    success: true,
    message: "Authorized",
    productSlug: data.productSlug,
    downloadAuthorized: true,
  });
};
