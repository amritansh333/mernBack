import express from "express";
import {
  getBrandsBySubCategoryId,
  getBrandsBySubCategorySlug,
} from "../modules/semiFinished/controllers/semiFinishedCatalogController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateQueryObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/by-subcategory/:slug", asyncHandler(getBrandsBySubCategorySlug));
router.get(
  "/",
  validateQueryObjectId("subcategory", "SubCategory ID"),
  asyncHandler(getBrandsBySubCategoryId)
);

export default router;
