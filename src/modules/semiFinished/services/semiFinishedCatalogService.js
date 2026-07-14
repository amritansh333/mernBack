import mongoose from "mongoose";
import Brand from "../../../models/Brand.js";
import Category from "../../../models/Category.js";
import Product from "../../../models/Product.js";
import SubCategory from "../../../models/SubCategory.js";
import { PRODUCT_EXPERIENCES } from "../../../constants/productExperiences.js";

const semiFinishedFilter = {
  experience: PRODUCT_EXPERIENCES.SEMI_FINISHED,
};

const legacyProductProjection =
  "-experience -category -subCategory -path -downloads -seo -isVisible";

/**
 * Returns legacy category documents for the original category endpoint.
 */
export const getAllCategories = () => Category.find().lean();

/**
 * Returns categories visible in the Semi Finished product experience.
 */
export const getSemiFinishedCategories = () =>
  Category.find(semiFinishedFilter).sort({ order: 1, name: 1 }).lean();

export const getCategoryBySlug = (slug) => Category.findOne({ slug }).lean();

/**
 * Returns Semi Finished subcategories for a legacy category ObjectId.
 */
export const getSubCategoriesByCategoryId = (categoryId) =>
  SubCategory.find({
    category: new mongoose.Types.ObjectId(categoryId),
  })
    .sort({ order: 1 })
    .lean();

export const getSubCategoriesByCategorySlug = async (slug) => {
  const category = await Category.findOne({ slug }).select("_id").lean();

  if (!category) {
    return null;
  }

  const subcategories = await SubCategory.find({
    category: category._id,
  })
    .sort({ order: 1 })
    .lean();

  return { category, subcategories };
};

/**
 * Returns Semi Finished brands for a legacy subcategory ObjectId.
 */
export const getBrandsBySubCategoryId = (subCategoryId) =>
  Brand.find({
    subCategory: new mongoose.Types.ObjectId(subCategoryId),
  })
    .sort({ order: 1 })
    .lean();

export const getBrandsBySubCategorySlug = async (slug) => {
  const subCategory = await SubCategory.findOne({ slug }).select("_id").lean();

  if (!subCategory) {
    return null;
  }

  const brands = await Brand.find({
    subCategory: subCategory._id,
  })
    .sort({ order: 1 })
    .lean();

  return { subCategory, brands };
};

/**
 * Returns legacy product documents for a Semi Finished brand ObjectId.
 */
export const getProductsByBrandId = (brandId) =>
  Product.find({
    brand: new mongoose.Types.ObjectId(brandId),
  })
    .select(legacyProductProjection)
    .sort({ order: 1 })
    .populate("brand")
    .populate("materials")
    .populate("industries")
    .lean();

export const getProductsByBrandSlug = async (slug) => {
  const brand = await Brand.findOne({ slug }).select("_id").lean();

  if (!brand) {
    return null;
  }

  const products = await Product.find({
    brand: brand._id,
  })
    .select(legacyProductProjection)
    .sort({ order: 1 })
    .populate("brand")
    .populate("materials", "name")
    .populate("industries")
    .lean();

  return { brand, products };
};

/**
 * Returns a legacy Semi Finished product document by slug.
 */
export const getProductBySlug = (slug) =>
  Product.findOne({ slug })
    .select(legacyProductProjection)
    .populate("brand")
    .populate("materials")
    .populate("industries")
    .lean();

export default {
  getAllCategories,
  getSemiFinishedCategories,
  getCategoryBySlug,
  getSubCategoriesByCategoryId,
  getSubCategoriesByCategorySlug,
  getBrandsBySubCategoryId,
  getBrandsBySubCategorySlug,
  getProductsByBrandId,
  getProductsByBrandSlug,
  getProductBySlug,
};
