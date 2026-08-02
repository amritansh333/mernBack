import env from "../../../config/env.js";
import Lead from "../models/Lead.js";
import OtpSession from "../models/OtpSession.js";
import {
  generateOTP,
  generateSessionToken,
  hashSessionToken,
  hashOTP,
  timingSafeHashCompare,
} from "../services/brochureService.js";
import {
  validateDownloadParams,
  validateRequestOtpBody,
  validateResendOtpBody,
  validateVerifyOtpBody,
} from "../validators/requestOtpValidator.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const MAX_RESEND_REQUESTS = 3;
const RESEND_WINDOW_MINUTES = 15;

const getOtpExpiresAt = () =>
  new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

const deleteExpiredSessions = () =>
  OtpSession.deleteMany({ expiresAt: { $lte: new Date() } });

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
  const otpHash = hashOTP(otp);
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
  });

  const response = {
    success: true,
    message: "OTP generated successfully",
    expiresAt,
  };

  if (!env.isProduction) {
    response.otp = otp;
  }

  return res.status(201).json(response);
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

    return res.status(409).json({
      success: false,
      message: "OTP session expired",
    });
  }

  if (session.verified) {
    return res.status(409).json({
      success: false,
      message: "OTP session already verified",
    });
  }

  if (session.attempts >= MAX_OTP_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: "Maximum OTP attempts exceeded",
    });
  }

  const incomingOtpHash = hashOTP(data.otp);
  const isValidOtp = timingSafeHashCompare(incomingOtpHash, session.otpHash);

  if (!isValidOtp) {
    session.attempts += 1;
    await session.save();

    return res.status(401).json({
      success: false,
      message: "Invalid OTP",
      attemptsRemaining: Math.max(0, MAX_OTP_ATTEMPTS - session.attempts),
    });
  }

  const rawSessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(rawSessionToken);
  const verifiedAt = new Date();

  session.verified = true;
  session.verifiedAt = verifiedAt;
  session.sessionTokenHash = sessionTokenHash;
  await session.save();

  await Lead.updateOne(
    { _id: session.leadId._id },
    {
      status: "verified",
      verifiedAt,
    },
  );

  return res.status(200).json({
    sessionToken: rawSessionToken,
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

    return res.status(409).json({
      success: false,
      message: "OTP session expired",
    });
  }

  if (session.verified) {
    return res.status(409).json({
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
  const otpHash = hashOTP(otp);
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
    resendCount: resendState.resendCount,
    resendWindowStartedAt: resendState.resendWindowStartedAt,
  });

  const response = {
    success: true,
    message: "OTP resent successfully",
    expiresAt,
  };

  if (!env.isProduction) {
    response.otp = otp;
  }

  return res.status(201).json(response);
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

  if (lead.productSlug !== data.productSlug) {
    return res.status(403).json({
      success: false,
      message: "Brochure session does not match requested product",
    });
  }

  lead.downloadCount += 1;
  lead.status = "download_authorized";
  lead.lastDownloadedAt = new Date();
  await lead.save();

  return res.status(200).json({
    success: true,
    message: "Authorized",
    productSlug: data.productSlug,
    downloadAuthorized: true,
  });
};
