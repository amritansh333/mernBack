import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";
import { adminResponse } from "../common/middleware/adminResponse.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();

router.use(adminResponse);

router.get("/", requirePermission('industries.read'), asyncHandler(controller.listIndustries));
router.get("/:id", requirePermission('industries.read'), asyncHandler(controller.getIndustry));
router.post(
  "/",
  requirePermission('industries.create'),
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createIndustry),
);
router.put("/:id", requirePermission('industries.update'), asyncHandler(controller.updateIndustry));
router.patch("/:id", requirePermission('industries.update'), asyncHandler(controller.updateIndustry));
router.delete("/:id", requirePermission('industries.delete'), asyncHandler(controller.deleteIndustry));
router.post("/bulk-delete", requirePermission('industries.delete'), asyncHandler(controller.bulkDelete));

export default router;
