import Product from "../models/Product.js";
import mongoose from "mongoose";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { brand } = req.query;

    let filter = {};

    if (brand) {
      filter.brand = brand;
    }

    const products = await Product.find(filter)
      .populate("brand")
      .populate("materials", "name")
      .lean();

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by brand slug
export const getProductsByBrandSlug = async (req, res) => {
  try {

    const brand = await mongoose.model("Brand").findOne({
      slug: req.params.slug
    });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const products = await Product.find({
      brand: brand._id
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};