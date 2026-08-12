import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('websiteContent.read'), asyncHandler(controller.listContent));
router.get("/:id", requirePermission('websiteContent.read'), asyncHandler(controller.getContent));
router.post("/", requirePermission('websiteContent.create'), asyncHandler(controller.createContent));
router.put("/:id", requirePermission('websiteContent.update'), asyncHandler(controller.updateContent));
router.delete("/:id", requirePermission('websiteContent.delete'), asyncHandler(controller.deleteContent));
router.post("/bulk-delete", requirePermission('websiteContent.delete'), asyncHandler(controller.bulkDelete));

export default router;
