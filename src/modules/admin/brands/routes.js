import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('brands.read'), asyncHandler(controller.listBrands));
router.get("/:id", requirePermission('brands.read'), asyncHandler(controller.getBrand));
router.post(
  "/",
  requirePermission('brands.create'),
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createBrand),
);
router.put("/:id", requirePermission('brands.update'), asyncHandler(controller.updateBrand));
router.patch("/:id", requirePermission('brands.update'), asyncHandler(controller.updateBrand));
router.delete("/:id", requirePermission('brands.delete'), asyncHandler(controller.deleteBrand));
router.post("/bulk-delete", requirePermission('brands.delete'), asyncHandler(controller.bulkDelete));

export default router;
