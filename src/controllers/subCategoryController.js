import SubCategory from "../models/SubCategory.js";
import mongoose from "mongoose";

export const getSubCategories = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(200).json([]);
    }

    const subcategories = await SubCategory.find({
      category: new mongoose.Types.ObjectId(category),
    });

    return res.status(200).json(subcategories);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};