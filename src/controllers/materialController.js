import Material from "../models/Material.js";
import Product from "../models/Product.js";

export const getAllMaterials = async (req, res) => {
  const materials = await Material.find().sort({ name: 1 }).lean();
  res.json(materials);
};

export const getMaterialBySlug = async (req, res) => {
  const { slug } = req.params;

  const material = await Material.findOne({ slug }).lean();
  if (!material) {
    return res.status(404).json({ message: "Material not found" });
  }

  const products = await Product.find({ materials: material._id })
    .sort({ order: 1 })
    .lean();

  return res.json({
    material,
    products,
  });
};
