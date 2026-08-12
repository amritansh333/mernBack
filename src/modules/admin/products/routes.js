import express from "express";
import upload from "../../../utils/upload.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('products.read'), asyncHandler(controller.listProducts));
router.get("/search", requirePermission('products.read'), asyncHandler(controller.listProducts));
router.get("/:id", requirePermission('products.read'), asyncHandler(controller.getProduct));

router.post(
  "/",
  requirePermission('products.create'),
  upload.uploadSingle("products"),
  asyncHandler(controller.createProduct),
);
router.put(
  "/:id",
  requirePermission('products.update'),
  upload.uploadSingle("products"),
  asyncHandler(controller.updateProduct),
);
router.patch(
  "/:id",
  requirePermission('products.update'),
  upload.uploadSingle("products"),
  asyncHandler(controller.updateProduct),
);

router.delete("/:id", requirePermission('products.delete'), asyncHandler(controller.deleteProduct));
router.post("/bulk-delete", requirePermission('products.delete'), asyncHandler(controller.bulkDelete));
router.patch("/bulk-status", requirePermission('products.update'), asyncHandler(controller.bulkStatusUpdate));

export default router;
