import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import {
  downloadBrochure,
  requestOtp,
  resendOtp,
  verifyOtp,
} from "../controllers/brochureController.js";
import { requireVerifiedBrochureSession } from "../middleware/requireVerifiedBrochureSession.js";

const router = express.Router();

router.post("/request-otp", asyncHandler(requestOtp));
router.post("/verify-otp", asyncHandler(verifyOtp));
router.post("/resend-otp", asyncHandler(resendOtp));
router.get(
  "/download/:productSlug",
  asyncHandler(requireVerifiedBrochureSession),
  asyncHandler(downloadBrochure),
);

export default router;
