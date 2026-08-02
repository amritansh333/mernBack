import crypto from "crypto";

const OTP_LENGTH = 6;
const SESSION_TOKEN_BYTES = 64;

export const generateOTP = () =>
  crypto
    .randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");

export const hashValue = (value) =>
  crypto.createHash("sha256").update(String(value)).digest("hex");

export const hashOTP = (otp) => hashValue(otp);

export const generateSessionToken = () =>
  crypto.randomBytes(SESSION_TOKEN_BYTES).toString("hex");

export const hashSessionToken = (token) => hashValue(token);

export const timingSafeHashCompare = (firstHash, secondHash) => {
  const firstBuffer = Buffer.from(String(firstHash), "hex");
  const secondBuffer = Buffer.from(String(secondHash), "hex");

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(firstBuffer, secondBuffer);
};
