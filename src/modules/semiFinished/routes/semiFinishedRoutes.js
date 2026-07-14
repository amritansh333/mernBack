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

const router = express.Router();

router.get("/categories", getSemiFinishedCategories);
router.get("/subcategories/by-category/:slug", getSubCategoriesByCategorySlug);
router.get("/subcategories", getSubCategoriesByCategoryId);
router.get("/brands/by-subcategory/:slug", getBrandsBySubCategorySlug);
router.get("/brands", getBrandsBySubCategoryId);
router.get("/products/by-brand/:slug", getProductsByBrandSlug);
router.get("/products", getProductsByBrandId);
router.get("/products/:slug", getProductBySlug);

export default router;
