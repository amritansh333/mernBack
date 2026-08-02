import Lead from "../models/Lead.js";
import OtpSession from "../models/OtpSession.js";
import { hashSessionToken } from "../services/brochureService.js";

const getBearerToken = (authorization = "") => {
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return "";
  }

  return token.trim();
};

export const requireVerifiedBrochureSession = async (req, res, next) => {
  const token = getBearerToken(req.get("Authorization"));

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required",
    });
  }

  const sessionTokenHash = hashSessionToken(token);
  const session = await OtpSession.findOne({ sessionTokenHash });

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid brochure session",
    });
  }

  if (session.expiresAt <= new Date()) {
    await OtpSession.deleteOne({ _id: session._id });

    return res.status(401).json({
      success: false,
      message: "Brochure session expired",
    });
  }

  if (!session.verified) {
    return res.status(403).json({
      success: false,
      message: "Brochure session is not verified",
    });
  }

  const lead = await Lead.findById(session.leadId);

  if (!lead) {
    return res.status(401).json({
      success: false,
      message: "Invalid brochure session",
    });
  }

  req.brochureLead = lead;
  req.brochureOtpSession = session;

  return next();
};
