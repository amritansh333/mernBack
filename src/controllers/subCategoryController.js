import SubCategory from "../models/SubCategory.js";
import mongoose from "mongoose";

export const getSubCategoriesByCategorySlug = async (req, res) => {
  try {

    const category = await mongoose.model("Category").findOne({
      slug: req.params.slug
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategories = await SubCategory.find({
      category: category._id
    });

    res.json(subcategories);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};