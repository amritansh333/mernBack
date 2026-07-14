import Industry from "../models/Industry.js";
import Product from "../models/Product.js";

export const getAllIndustries = async (req, res) => {
  const industries = await Industry.find().sort({ name: 1 }).lean();
  res.json(industries);
};

export const getIndustryBySlug = async (req, res) => {
  const { slug } = req.params;

  const industry = await Industry.findOne({ slug }).lean();
  if (!industry) {
    return res.status(404).json({ message: "Industry not found" });
  }

  const products = await Product.find({ industries: industry._id })
    .sort({ order: 1 })
    .lean();

  return res.json({
    industry,
    products,
  });
};
