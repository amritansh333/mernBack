import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('subcategories.read'), asyncHandler(controller.listSubcategories));
router.get("/:id", requirePermission('subcategories.read'), asyncHandler(controller.getSubcategory));
router.post(
  "/",
  requirePermission('subcategories.create'),
  requireBodyKeys(["name", "slug", "category"]),
  asyncHandler(controller.createSubcategory),
);
router.put("/:id", requirePermission('subcategories.update'), asyncHandler(controller.updateSubcategory));
router.patch("/:id", requirePermission('subcategories.update'), asyncHandler(controller.updateSubcategory));
router.delete("/:id", requirePermission('subcategories.delete'), asyncHandler(controller.deleteSubcategory));
router.post("/bulk-delete", requirePermission('subcategories.delete'), asyncHandler(controller.bulkDelete));

export default router;
