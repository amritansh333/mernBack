import Material from "../models/Material.js";
import Product from "../models/Product.js";

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ name: 1 }).lean();
    res.json(materials);
  } catch {
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};

export const getMaterialBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const material = await Material.findOne({ slug }).lean();
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const products = await Product.find({
      materials: material._id
    }).sort({ order: 1 }).lean();

    res.json({
      material,
      products
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch material data" });
  }
};
