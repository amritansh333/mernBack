import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import { requestOtp } from "../controllers/brochureController.js";

const router = express.Router();

router.post("/request-otp", asyncHandler(requestOtp));

export default router;
