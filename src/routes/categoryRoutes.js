import express from "express";
import {
  getAllCategories,
  getCategoryBySlug,
} from "../modules/semiFinished/controllers/semiFinishedCatalogController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getAllCategories));
router.get("/:slug", asyncHandler(getCategoryBySlug));
export default router;
