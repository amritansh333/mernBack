import Brand from "../models/Brand.js";
import mongoose from "mongoose";

export const getBrands = async (req, res) => {
  try {
    const { subcategory } = req.query;

    if (!subcategory || !mongoose.Types.ObjectId.isValid(subcategory)) {
      return res.status(200).json([]);
    }

    const brands = await Brand.find({
      subcategory: new mongoose.Types.ObjectId(subcategory),
    });

    return res.status(200).json(brands);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};