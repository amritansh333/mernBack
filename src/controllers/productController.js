import Product from "../models/Product.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { brand } = req.query;

    let filter = {};

    // If brand query exists, filter by brand
    if (brand) {
      filter.brand = brand;
    }

    const products = await Product.find(filter)
      .populate("brand")
      .sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by slug (SEO-friendly)

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("brand")
      .populate("materials")
      .populate("industries");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // IMPORTANT: always return full object
    return res.status(200).json(product);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
