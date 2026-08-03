import express from "express";
import rateLimit from "express-rate-limit";
import asyncHandler from "../../../middleware/asyncHandler.js";
import {
  checkBrochureSession,
  downloadBrochure,
  requestOtp,
  resendOtp,
  verifyOtp,
} from "../controllers/brochureController.js";
import { requireBrochureSession } from "../middleware/requireBrochureSession.js";

const router = express.Router();

const otpRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests, please try again later.",
  },
});

const otpVerifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP verification attempts, please try again later.",
  },
});

const brochureDownloadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many brochure download requests, please try again later.",
  },
});

router.post("/request-otp", otpRequestRateLimiter, asyncHandler(requestOtp));
router.post("/verify-otp", otpVerifyRateLimiter, asyncHandler(verifyOtp));
router.post("/resend-otp", otpRequestRateLimiter, asyncHandler(resendOtp));
router.get("/session", asyncHandler(checkBrochureSession));
router.get("/check-session", asyncHandler(checkBrochureSession));
router.get(
  "/download/:productSlug",
  brochureDownloadRateLimiter,
  asyncHandler(requireBrochureSession),
  asyncHandler(downloadBrochure),
);

export default router;
