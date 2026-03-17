import Brand from "../models/Brand.js";
import mongoose from "mongoose";

export const getBrandsBySubCategorySlug = async (req, res) => {
  try {

    const sub = await mongoose.model("SubCategory").findOne({
      slug: req.params.slug
    });

    if (!sub) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    const brands = await Brand.find({
      subCategory: sub._id
    });

    res.json(brands);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};