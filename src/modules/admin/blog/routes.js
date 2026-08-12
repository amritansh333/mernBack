import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { validateObjectIdParam } from "../common/middleware/adminValidation.js";
import { adminResponse } from "../common/middleware/adminResponse.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
router.use(adminResponse);

router.get("/", requirePermission('blogGallery.read'), asyncHandler(controller.listBlogs));
router.get("/categories", requirePermission('blogGallery.read'), asyncHandler(controller.listCategories));
router.get(
  "/:id",
  validateObjectIdParam("id"),
  requirePermission('blogGallery.read'),
  asyncHandler(controller.getBlog),
);
router.post("/", requirePermission('blogGallery.create'), asyncHandler(controller.createBlog));
router.put(
  "/:id",
  validateObjectIdParam("id"),
  requirePermission('blogGallery.update'),
  asyncHandler(controller.updateBlog),
);
router.patch(
  "/:id",
  validateObjectIdParam("id"),
  requirePermission('blogGallery.update'),
  asyncHandler(controller.updateBlog),
);
router.delete(
  "/:id",
  validateObjectIdParam("id"),
  requirePermission('blogGallery.delete'),
  asyncHandler(controller.deleteBlog),
);
router.patch(
  "/:id/publish",
  validateObjectIdParam("id"),
  requirePermission('blogGallery.update'),
  asyncHandler(controller.publishBlog),
);
router.patch(
  "/:id/unpublish",
  validateObjectIdParam("id"),
  requirePermission('blogGallery.update'),
  asyncHandler(controller.unpublishBlog),
);
router.post(
  "/:id/duplicate",
  validateObjectIdParam("id"),
  requirePermission('blogGallery.create'),
  asyncHandler(controller.duplicateBlog),
);

export default router;
