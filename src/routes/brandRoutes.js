import express from "express";
import mongoose from "mongoose";
import Brand from "../models/Brand.js";

const router = express.Router();

// GET BRANDS BY SUBCATEGORY
router.get("/", async (req, res) => {
  try {
    const { subcategory } = req.query;

    if (!subcategory) {
      return res.status(400).json({ message: "SubCategory ID required" });
    }

    const brands = await Brand.find({
      subCategory: new mongoose.Types.ObjectId(subcategory),
    }).sort({ name: 1 });

    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;