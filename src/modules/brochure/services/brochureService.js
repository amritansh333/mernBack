import crypto from "crypto";
import bcrypt from "bcryptjs";
import env from "../../../config/env.js";

const OTP_LENGTH = 6;
const BCRYPT_ROUNDS = 12;
const JWT_ALGORITHM = "HS256";

const developmentJwtSecret = crypto.randomBytes(64).toString("hex");

const getJwtSecret = () => env.brochureJwtSecret || developmentJwtSecret;

const base64UrlEncode = (value) => Buffer.from(value).toString("base64url");

const base64UrlJson = (value) => base64UrlEncode(JSON.stringify(value));

export const generateOTP = () =>
  crypto.randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString();

export const hashOTP = (otp) => bcrypt.hash(String(otp), BCRYPT_ROUNDS);

export const verifyOTPHash = (otp, otpHash) =>
  bcrypt.compare(String(otp), String(otpHash));

export const generateSessionId = () => crypto.randomUUID();

export const createBrochureJwt = ({ leadId, sessionId, expiresAt }) => {
  const header = {
    alg: JWT_ALGORITHM,
    typ: "JWT",
  };
  const payload = {
    sub: String(leadId),
    sid: String(sessionId),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expiresAt.getTime() / 1000),
  };

  const unsignedToken = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
};

export const verifyBrochureJwt = (token) => {
  const parts = String(token || "").split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  let header;
  let payload;

  try {
    header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString());
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
  } catch {
    return null;
  }

  if (header.alg !== JWT_ALGORITHM || header.typ !== "JWT") {
    return null;
  }

  if (!payload.sub || !payload.sid || !payload.exp) {
    return null;
  }

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
};
