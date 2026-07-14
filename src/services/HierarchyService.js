import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import { toIdString } from "../utils/ids.js";

const categoryProjection = "name slug experience order";
const subCategoryProjection = "name slug category experience image order";
const brandProjection = "name slug subCategory experience image order materials";

export const getCategoryBySlug = (slug, extraFilter = {}) =>
  Category.findOne({ slug, ...extraFilter }).select(categoryProjection).lean();

export const getSubCategoryBySlug = (slug, extraFilter = {}) =>
  SubCategory.findOne({ slug, ...extraFilter })
    .select(subCategoryProjection)
    .lean();

export const getBrandBySlug = (slug, extraFilter = {}) =>
  Brand.findOne({ slug, ...extraFilter }).select(brandProjection).lean();

export const getSubCategoriesByCategory = (categoryId, extraFilter = {}) =>
  SubCategory.find({ category: categoryId, ...extraFilter })
    .select(subCategoryProjection)
    .sort({ order: 1, name: 1 })
    .lean();

export const getBrandsBySubCategory = (subCategoryId, extraFilter = {}) =>
  Brand.find({ subCategory: subCategoryId, ...extraFilter })
    .select(brandProjection)
    .sort({ order: 1, name: 1 })
    .lean();

export const getHierarchyForBrand = async (brandId) => {
  const brand = await Brand.findById(brandId).select(brandProjection).lean();

  if (!brand) {
    return null;
  }

  const subCategory = await SubCategory.findById(brand.subCategory)
    .select(subCategoryProjection)
    .lean();

  if (!subCategory) {
    return null;
  }

  const category = await Category.findById(subCategory.category)
    .select(categoryProjection)
    .lean();

  if (!category) {
    return null;
  }

  return { category, subCategory, brand };
};

export const getHierarchyForProduct = async (product) => {
  const categoryId = toIdString(product.category);
  const subCategoryId = toIdString(product.subCategory);

  if (categoryId && subCategoryId) {
    const [category, subCategory, brand] = await Promise.all([
      Category.findById(categoryId).select(categoryProjection).lean(),
      SubCategory.findById(subCategoryId).select(subCategoryProjection).lean(),
      product.brand
        ? Brand.findById(product.brand).select(brandProjection).lean()
        : Promise.resolve(null),
    ]);

    if (category && subCategory) {
      return { category, subCategory, brand };
    }
  }

  if (product.brand) {
    return getHierarchyForBrand(product.brand);
  }

  return null;
};

export default {
  getCategoryBySlug,
  getSubCategoryBySlug,
  getBrandBySlug,
  getSubCategoriesByCategory,
  getBrandsBySubCategory,
  getHierarchyForBrand,
  getHierarchyForProduct,
};
