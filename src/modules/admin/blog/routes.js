import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { validateObjectIdParam } from "../common/middleware/adminValidation.js";
import { adminResponse } from "../common/middleware/adminResponse.js";

const router = express.Router();
router.use(adminResponse);

router.get("/", asyncHandler(controller.listBlogs));
router.get("/categories", asyncHandler(controller.listCategories));
router.get(
  "/:id",
  validateObjectIdParam("id"),
  asyncHandler(controller.getBlog),
);
router.post("/", asyncHandler(controller.createBlog));
router.put(
  "/:id",
  validateObjectIdParam("id"),
  asyncHandler(controller.updateBlog),
);
router.patch(
  "/:id",
  validateObjectIdParam("id"),
  asyncHandler(controller.updateBlog),
);
router.delete(
  "/:id",
  validateObjectIdParam("id"),
  asyncHandler(controller.deleteBlog),
);
router.patch(
  "/:id/publish",
  validateObjectIdParam("id"),
  asyncHandler(controller.publishBlog),
);
router.patch(
  "/:id/unpublish",
  validateObjectIdParam("id"),
  asyncHandler(controller.unpublishBlog),
);
router.post(
  "/:id/duplicate",
  validateObjectIdParam("id"),
  asyncHandler(controller.duplicateBlog),
);

export default router;
