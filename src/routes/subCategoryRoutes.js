import express from "express";
import mongoose from "mongoose";
import SubCategory from "../models/SubCategory.js";
import { getSubCategoriesByCategorySlug } from "../controllers/subCategoryController.js";

const router = express.Router();

/* NEW ROUTE — USING SLUG */
router.get("/by-category/:slug", getSubCategoriesByCategorySlug);

/* OLD ROUTE — KEEP */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category ID required" });
    }

    const subCategories = await SubCategory.find({
      category: new mongoose.Types.ObjectId(category)
    });

    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;