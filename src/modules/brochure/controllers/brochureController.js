import env from "../../../config/env.js";
import Lead from "../models/Lead.js";
import OtpSession from "../models/OtpSession.js";
import {
  generateOTP,
  generateSessionToken,
  hashOTP,
} from "../services/brochureService.js";
import { validateRequestOtpBody } from "../validators/requestOtpValidator.js";

const OTP_EXPIRY_MINUTES = 5;

export const requestOtp = async (req, res) => {
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
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

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
    sessionToken,
  });

  const response = {
    success: true,
    message: "OTP generated successfully",
    leadId: lead._id,
    sessionToken,
    expiresAt,
  };

  if (!env.isProduction) {
    response.otp = otp;
  }

  return res.status(201).json(response);
};
