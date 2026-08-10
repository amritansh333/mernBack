import express from "express";
import upload from "../../../utils/upload.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listProducts));
router.get("/search", asyncHandler(controller.listProducts));
router.get("/:id", asyncHandler(controller.getProduct));

router.post(
  "/",
  upload.uploadSingle("products"),
  asyncHandler(controller.createProduct),
);
router.put(
  "/:id",
  upload.uploadSingle("products"),
  asyncHandler(controller.updateProduct),
);
router.patch(
  "/:id",
  upload.uploadSingle("products"),
  asyncHandler(controller.updateProduct),
);

router.delete("/:id", asyncHandler(controller.deleteProduct));
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));
router.patch("/bulk-status", asyncHandler(controller.bulkStatusUpdate));

export default router;
