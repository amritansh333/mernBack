import Material from "../models/Material.js";
import Product from "../models/Product.js";

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ name: 1 });
    res.json(materials);
  } catch {
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};

export const getMaterialBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const material = await Material.findOne({ slug });
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const products = await Product.find({
      materials: material.slug

    });

    res.json({
      material,
      products
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch material data" });
  }
};
