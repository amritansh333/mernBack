import express from "express";
import {
  getBrandsBySubCategoryId,
  getBrandsBySubCategorySlug,
  getProductBySlug,
  getProductsByBrandId,
  getProductsByBrandSlug,
  getSemiFinishedCategories,
  getSubCategoriesByCategoryId,
  getSubCategoriesByCategorySlug,
} from "../controllers/semiFinishedCatalogController.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import { validateQueryObjectId } from "../../../middleware/validateObjectId.js";

const router = express.Router();

router.get("/categories", asyncHandler(getSemiFinishedCategories));
router.get(
  "/subcategories/by-category/:slug",
  asyncHandler(getSubCategoriesByCategorySlug)
);
router.get(
  "/subcategories",
  validateQueryObjectId("category", "Category ID"),
  asyncHandler(getSubCategoriesByCategoryId)
);
router.get("/brands/by-subcategory/:slug", asyncHandler(getBrandsBySubCategorySlug));
router.get(
  "/brands",
  validateQueryObjectId("subcategory", "SubCategory ID"),
  asyncHandler(getBrandsBySubCategoryId)
);
router.get("/products/by-brand/:slug", asyncHandler(getProductsByBrandSlug));
router.get(
  "/products",
  validateQueryObjectId("brand", "Brand ID"),
  asyncHandler(getProductsByBrandId)
);
router.get("/products/:slug", asyncHandler(getProductBySlug));

export default router;
