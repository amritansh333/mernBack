import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('materials.read'), asyncHandler(controller.listMaterials));
router.get("/:id", requirePermission('materials.read'), asyncHandler(controller.getMaterial));
router.post(
  "/",
  requirePermission('materials.create'),
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createMaterial),
);
router.put("/:id", requirePermission('materials.update'), asyncHandler(controller.updateMaterial));
router.patch("/:id", requirePermission('materials.update'), asyncHandler(controller.updateMaterial));
router.delete("/:id", requirePermission('materials.delete'), asyncHandler(controller.deleteMaterial));
router.post("/bulk-delete", requirePermission('materials.delete'), asyncHandler(controller.bulkDelete));

export default router;
