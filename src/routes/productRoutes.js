import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

// GET PRODUCTS BY BRAND
router.get("/", async (req, res) => {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({ message: "Brand ID required" });
    }

    const products = await Product.find({
      brand: new mongoose.Types.ObjectId(brand),
    })
      .populate("brand")
      .populate("materials")
      .populate("industries");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE PRODUCT BY SLUG
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("brand")
      .populate("materials")
      .populate("industries");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;