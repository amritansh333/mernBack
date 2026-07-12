import mongoose from "mongoose";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Industry from "../models/Industry.js";
import Material from "../models/Material.js";
import Product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";

const isUsableFilterValue = (value) => value && value !== "undefined";

const resolveDocumentId = async (Model, value) => {
  if (!isUsableFilterValue(value)) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }

  const document = await Model.findOne({ slug: value }).select("_id").lean();
  return document?._id || null;
};

const emptyFilterResponse = ({ category, material, industry, search }) => ({
  filtersApplied: {
    category: category || null,
    material: material || null,
    industry: industry || null,
    search: search || null,
  },
  products: [],
});

export const filterProducts = async (req, res) => {
  try {
    const {
      category,
      material,
      industry,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (isUsableFilterValue(category)) {
      const categoryId = await resolveDocumentId(Category, category);

      if (!categoryId) {
        return res.json(
          emptyFilterResponse({ category, material, industry, search })
        );
      }

      const subCategoryIds = await SubCategory.find({ category: categoryId })
        .select("_id")
        .lean();

      const brandIds = await Brand.find({
        subCategory: { $in: subCategoryIds.map((item) => item._id) },
      })
        .select("_id")
        .lean();

      query.brand = { $in: brandIds.map((item) => item._id) };
    }

    if (isUsableFilterValue(material)) {
      const materialId = await resolveDocumentId(Material, material);

      if (!materialId) {
        return res.json(
          emptyFilterResponse({ category, material, industry, search })
        );
      }

      query.materials = { $in: [materialId] };
    }

    if (isUsableFilterValue(industry)) {
      const industryId = await resolveDocumentId(Industry, industry);

      if (!industryId) {
        return res.json(
          emptyFilterResponse({ category, material, industry, search })
        );
      }

      query.industries = { $in: [industryId] };
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { description: { $elemMatch: { $regex: search, $options: "i" } } },
        { keyFeatures: { $elemMatch: { $regex: search, $options: "i" } } },
        { applications: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const skip = (pageNumber - 1) * pageLimit;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    res.json({
      filtersApplied: {
        category: category || null,
        material: material || null,
        industry: industry || null,
        search: search || null,
      },
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Filter failed",
      error: error.message,
    });
  }
};
