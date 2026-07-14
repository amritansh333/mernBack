import express from "express";
import {
  getSubCategoriesByCategoryId,
  getSubCategoriesByCategorySlug,
} from "../modules/semiFinished/controllers/semiFinishedCatalogController.js";

const router = express.Router();

router.get("/by-category/:slug", getSubCategoriesByCategorySlug);
router.get("/", getSubCategoriesByCategoryId);

export default router;
