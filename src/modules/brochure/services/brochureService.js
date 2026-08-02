import crypto from "crypto";

const OTP_LENGTH = 6;

export const generateOTP = () =>
  crypto
    .randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");

export const hashOTP = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

export const generateSessionToken = () =>
  crypto.randomBytes(32).toString("hex");
