import mongoose from "mongoose";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Industry from "../models/Industry.js";
import Material from "../models/Material.js";
import Product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";

const isUsableFilterValue = (value) => value && value !== "undefined";
const legacyProductProjection =
  "-experience -category -subCategory -path -downloads -seo -isVisible";

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

/**
 * Filters legacy Semi Finished products by category, material, industry, and text.
 */
export const filterProducts = async ({
  category,
  material,
  industry,
  search,
  page = 1,
  limit = 12,
}) => {
  const query = {};
  const andConditions = [];

  if (isUsableFilterValue(category)) {
    const categoryId = await resolveDocumentId(Category, category);

    if (!categoryId) {
      return emptyFilterResponse({ category, material, industry, search });
    }

    const subCategoryIds = await SubCategory.find({ category: categoryId })
      .select("_id")
      .lean();

    const subCategoryObjectIds = subCategoryIds.map((item) => item._id);

    const brandIds = await Brand.find({
      subCategory: { $in: subCategoryObjectIds },
    })
      .select("_id")
      .lean();

    andConditions.push({
      $or: [
        { category: categoryId },
        { subCategory: { $in: subCategoryObjectIds } },
        { brand: { $in: brandIds.map((item) => item._id) } },
      ],
    });
  }

  if (isUsableFilterValue(material)) {
    const materialId = await resolveDocumentId(Material, material);

    if (!materialId) {
      return emptyFilterResponse({ category, material, industry, search });
    }

    query.materials = { $in: [materialId] };
  }

  if (isUsableFilterValue(industry)) {
    const industryId = await resolveDocumentId(Industry, industry);

    if (!industryId) {
      return emptyFilterResponse({ category, material, industry, search });
    }

    query.industries = { $in: [industryId] };
  }

  if (search && search.trim() !== "") {
    andConditions.push({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { description: { $elemMatch: { $regex: search, $options: "i" } } },
        { keyFeatures: { $elemMatch: { $regex: search, $options: "i" } } },
        { applications: { $elemMatch: { $regex: search, $options: "i" } } },
      ],
    });
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  const pageNumber = Number(page);
  const pageLimit = Number(limit);
  const skip = (pageNumber - 1) * pageLimit;

  const products = await Product.find(query)
    .select(legacyProductProjection)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageLimit)
    .lean();

  return {
    filtersApplied: {
      category: category || null,
      material: material || null,
      industry: industry || null,
      search: search || null,
    },
    products,
  };
};

export default {
  filterProducts,
};
