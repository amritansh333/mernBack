import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('categories.read'), asyncHandler(controller.listCategories));
router.get("/:id", requirePermission('categories.read'), asyncHandler(controller.getCategory));
router.post(
  "/",
  requirePermission('categories.create'),
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createCategory),
);
router.put("/:id", requirePermission('categories.update'), asyncHandler(controller.updateCategory));
router.patch("/:id", requirePermission('categories.update'), asyncHandler(controller.updateCategory));
router.delete("/:id", requirePermission('categories.delete'), asyncHandler(controller.deleteCategory));
router.post("/bulk-delete", requirePermission('categories.delete'), asyncHandler(controller.bulkDelete));

export default router;
