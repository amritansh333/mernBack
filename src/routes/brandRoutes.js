import express from "express";
import mongoose from "mongoose";
import Brand from "../models/Brand.js";
import { getBrandsBySubCategorySlug } from "../controllers/brandController.js";

const router = express.Router();

/* NEW ROUTE — USING SLUG */
router.get("/by-subcategory/:slug", getBrandsBySubCategorySlug);

/* OLD ROUTE — KEEP FOR QUERY SUPPORT */
router.get("/", async (req, res) => {
  try {
    const { subcategory } = req.query;

    if (!subcategory) {
      return res.status(400).json({ message: "SubCategory ID required" });
    }

    const brands = await Brand.find({
      subCategory: new mongoose.Types.ObjectId(subcategory),
    });

    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;