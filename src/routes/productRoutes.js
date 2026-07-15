import express from "express";
import {
  getProductBySlug,
  getProductsByBrandId,
  getProductsByBrandSlug,
} from "../modules/semiFinished/controllers/semiFinishedCatalogController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateQueryObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/by-brand/:slug", asyncHandler(getProductsByBrandSlug));
router.get(
  "/",
  validateQueryObjectId("brand", "Brand ID"),
  asyncHandler(getProductsByBrandId)
);
router.get("/:slug", asyncHandler(getProductBySlug));

export default router;
