import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listBrands));
router.get("/:id", asyncHandler(controller.getBrand));
router.post(
  "/",
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createBrand),
);
router.put("/:id", asyncHandler(controller.updateBrand));
router.patch("/:id", asyncHandler(controller.updateBrand));
router.delete("/:id", asyncHandler(controller.deleteBrand));
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));

export default router;
