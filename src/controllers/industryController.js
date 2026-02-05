import Industry from "../models/Industry.js";
import Product from "../models/Product.js";

/**
 * GET /api/industries
 * Returns all industries
 */
export const getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.find().sort({ name: 1 });
    res.json(industries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch industries" });
  }
};

/**
 * GET /api/industries/:slug
 * Returns one industry + related products
 */
export const getIndustryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Find industry
    const industry = await Industry.findOne({ slug });
    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    // 2. Find related products (TEMP LOGIC)
    const products = await Product.find({
      industries: industry.slug

    });

    res.json({
      industry,
      products
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch industry data" });
  }
};
