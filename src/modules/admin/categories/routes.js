import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listCategories));
router.get("/:id", asyncHandler(controller.getCategory));
router.post(
  "/",
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createCategory),
);
router.put("/:id", asyncHandler(controller.updateCategory));
router.patch("/:id", asyncHandler(controller.updateCategory));
router.delete("/:id", asyncHandler(controller.deleteCategory));
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));

export default router;
