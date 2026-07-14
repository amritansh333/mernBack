import express from "express";
import {
  getBrandsBySubCategoryId,
  getBrandsBySubCategorySlug,
} from "../modules/semiFinished/controllers/semiFinishedCatalogController.js";

const router = express.Router();

router.get("/by-subcategory/:slug", getBrandsBySubCategorySlug);
router.get("/", getBrandsBySubCategoryId);

export default router;
