import express from "express";
import {
  getSubCategoriesByCategoryId,
  getSubCategoriesByCategorySlug,
} from "../modules/semiFinished/controllers/semiFinishedCatalogController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateQueryObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/by-category/:slug", asyncHandler(getSubCategoriesByCategorySlug));
router.get(
  "/",
  validateQueryObjectId("category", "Category ID"),
  asyncHandler(getSubCategoriesByCategoryId)
);

export default router;
