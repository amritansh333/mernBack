import express from "express";
import mongoose from "mongoose";
import SubCategory from "../models/SubCategory.js";

const router = express.Router();

// GET SUBCATEGORIES BY CATEGORY
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category ID required" });
    }

    const subCategories = await SubCategory.find({
      category: new mongoose.Types.ObjectId(category),
    }).sort({ name: 1 });

    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;