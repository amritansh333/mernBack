import Brand from "../../../models/Brand.js";
import Category from "../../../models/Category.js";
import Product from "../../../models/Product.js";
import SubCategory from "../../../models/SubCategory.js";
import { PRODUCT_EXPERIENCE_IDS } from "../../../productExperiences/productExperienceRegistry.js";
import { getProductExperienceImplementation } from "../../../productExperiences/productExperienceFactory.js";

const machineExperienceImplementation = getProductExperienceImplementation(
  PRODUCT_EXPERIENCE_IDS.MACHINE_COMPONENTS
);

const {
  normalizeProduct,
  
} = machineExperienceImplementation;

if (!machineExperienceImplementation?.buildCatalogResponse) {
  throw new Error("Machine Components product experience is not registered");
}

const machineExperience = machineExperienceImplementation.experience;

const machineOrUnmigratedExperience = {
  $or: [
    { experience: machineExperience },
    { experience: { $exists: false } },
    { experience: null },
  ],
};

/**
 * Loads Machine Components catalog data and delegates response shaping to the experience.
 */
export const getMachineComponentsPage = async () => {
  const categories = await Category.find({
    experience: machineExperience,
    slug: machineExperienceImplementation.categorySlug,
  })
    .select("name slug experience order")
    .sort({ order: 1, name: 1 })
    .lean();

  if (!categories.length) {
    const catalog = machineExperienceImplementation.buildCatalogResponse({
      categories,
      subCategories: [],
      brands: [],
      products: [],
    });

    return {
      success: true,
      data: {
        experience: machineExperience,
        ...catalog,
      },
    };
  }

  const categoryIds = categories.map((category) => category._id);

  const subCategories = await SubCategory.find({
    category: { $in: categoryIds },
    ...machineOrUnmigratedExperience,
  })
    .select("name slug category experience image order")
    .sort({ order: 1, name: 1 })
    .lean();

  const subCategoryIds = subCategories.map((subCategory) => subCategory._id);

  const brands = await Brand.find({
    subCategory: { $in: subCategoryIds },
    ...machineOrUnmigratedExperience,
  })
    .select("name slug subCategory experience image order")
    .sort({ order: 1, name: 1 })
    .lean();

  const brandIds = brands.map((brand) => brand._id);

  const products = await Product.find({
    isVisible: { $ne: false },
    "machineComponentData.isVisible": { $ne: false },
    $and: [
      machineOrUnmigratedExperience,
      {
        $or: [
          { subCategory: { $in: subCategoryIds } },
          { brand: { $in: brandIds } },
          { category: { $in: categoryIds } },
        ],
      },
    ],
  })
    .select(
      "name slug path order category subCategory brand description keyFeatures applications specifications downloads pdfUrl image machineComponentData materials industries"
    )
    .populate("materials", "name slug")
    .populate("industries", "name slug")
    .lean();

  const catalog = machineExperienceImplementation.buildCatalogResponse({
    categories,
    subCategories,
    brands,
    products,
  });

  return {
    success: true,
    data: {
      experience: machineExperience,
      ...catalog,
    },
  };
};

export const getMachineComponentSubcategoryPage = async (slug) => {
  const subCategory = await SubCategory.findOne({
    slug,
    ...machineOrUnmigratedExperience,
  }).lean();

  if (!subCategory) {
    return {
      success: false,
      message: "Subcategory not found",
    };
  }

  const category = await Category.findById(subCategory.category)
    .select("name slug")
    .lean();

  const brands = await Brand.find({
    subCategory: subCategory._id,
    ...machineOrUnmigratedExperience,
  }).lean();

  const brandIds = brands.map((b) => b._id);

  const products = await Product.find({
    isVisible: { $ne: false },
    "machineComponentData.isVisible": { $ne: false },
    $or: [
      { subCategory: subCategory._id },
      { brand: { $in: brandIds } },
    ],
  })
    .populate("materials", "name slug")
    .populate("industries", "name slug")
    .lean();

  const categoryById = new Map([[String(category._id), category]]);
  const subCategoryById = new Map([[String(subCategory._id), subCategory]]);
  const brandById = new Map(
    brands.map((brand) => [String(brand._id), brand])
  );

  const normalizedProducts = products
    .map((product) =>
      normalizeProduct({
        product,
        brandById,
        subCategoryById,
        categoryById,
      })
    )
    .filter(Boolean);

  return {
    success: true,
    data: machineExperienceImplementation.buildSubcategoryResponse({
      subCategory,
      category,
      routingStrategy: machineExperienceImplementation.routingStrategy,
      products: normalizedProducts.map((p) => p.product),
    }),
  };
};

export default {
  getMachineComponentsPage,
  getMachineComponentSubcategoryPage,
};
