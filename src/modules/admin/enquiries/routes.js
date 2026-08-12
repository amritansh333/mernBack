import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('enquiries.read'), asyncHandler(controller.listEnquiries));
router.get("/:id", requirePermission('enquiries.read'), asyncHandler(controller.getEnquiry));
router.patch("/:id/status", requirePermission('enquiries.update'), asyncHandler(controller.updateEnquiryStatus));

export default router;
