import express from "express";
import {
  getAllCategories,
  getCategoryBySlug,
} from "../modules/semiFinished/controllers/semiFinishedCatalogController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);
export default router;
