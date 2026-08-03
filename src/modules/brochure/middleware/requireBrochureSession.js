import env from "../../../config/env.js";
import Lead from "../models/Lead.js";
import OtpSession from "../models/OtpSession.js";
import { verifyBrochureJwt } from "../services/brochureService.js";

const parseCookies = (cookieHeader = "") =>
  cookieHeader.split(";").reduce((cookies, cookie) => {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      return cookies;
    }

    const key = cookie.slice(0, separatorIndex).trim();
    const value = cookie.slice(separatorIndex + 1).trim();

    if (key) {
      try {
        cookies[key] = decodeURIComponent(value);
      } catch {
        cookies[key] = value;
      }
    }

    return cookies;
  }, {});

export const clearBrochureSessionCookie = (res) => {
  res.clearCookie(env.brochureSessionCookieName, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
  });
};

export const validateBrochureSession = async (req, res) => {
  const cookies = parseCookies(req.get("Cookie"));
  const token = cookies[env.brochureSessionCookieName];

  if (!token) {
    return {
      authenticated: false,
      message: "Brochure session required",
    };
  }

  const payload = verifyBrochureJwt(token);

  if (!payload) {
    clearBrochureSessionCookie(res);

    return {
      authenticated: false,
      message: "Invalid or expired brochure session",
    };
  }

  const session = await OtpSession.findOne({
    leadId: payload.sub,
    sessionId: payload.sid,
    verified: true,
  });

  if (!session) {
    clearBrochureSessionCookie(res);

    return {
      authenticated: false,
      message: "Invalid brochure session",
    };
  }

  if (!session.sessionExpiresAt || session.sessionExpiresAt <= new Date()) {
    await OtpSession.deleteOne({ _id: session._id });
    clearBrochureSessionCookie(res);

    return {
      authenticated: false,
      message: "Brochure session expired",
    };
  }

  const lead = await Lead.findById(session.leadId);

  if (!lead) {
    clearBrochureSessionCookie(res);

    return {
      authenticated: false,
      message: "Invalid brochure session",
    };
  }

  return {
    authenticated: true,
    lead,
    session,
    sessionId: payload.sid,
  };
};

export const requireBrochureSession = async (req, res, next) => {
  const result = await validateBrochureSession(req, res);

  if (!result.authenticated) {
    return res.status(401).json({
      success: false,
      message: result.message,
    });
  }

  req.brochureLead = result.lead;
  req.brochureOtpSession = result.session;
  req.brochureSessionId = result.sessionId;

  return next();
};

export default requireBrochureSession;
