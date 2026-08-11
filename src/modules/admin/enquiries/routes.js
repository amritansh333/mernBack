import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listEnquiries));
router.get("/:id", asyncHandler(controller.getEnquiry));
router.patch("/:id/status", asyncHandler(controller.updateEnquiryStatus));

export default router;
