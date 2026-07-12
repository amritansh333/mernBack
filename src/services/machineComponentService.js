import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";
import { PRODUCT_EXPERIENCES } from "../constants/productExperiences.js";

const toId = (value) => value?._id?.toString?.() || value?.toString?.() || null;

const toReference = (doc) => ({
  name: doc.name,
  slug: doc.slug,
});

const getProductOrder = (product) =>
  product.machineComponentData?.order ?? product.order ?? 99;

const sortByDisplayOrder = (items) =>
  [...items].sort((a, b) => {
    const orderDiff = (a.order ?? 99) - (b.order ?? 99);
    return orderDiff || a.name.localeCompare(b.name);
  });

const toSidebarProduct = (product) => ({
  name: product.name,
  slug: product.slug,
  order: getProductOrder(product),
});

const toProductContent = ({ product, brand, subCategory, category }) => {
  const machineData = product.machineComponentData || {};

  return {
    name: product.name,
    slug: product.slug,
    image: product.image || "",
    summary:
      machineData.summary ||
      (Array.isArray(product.description) ? product.description[0] || "" : ""),
    applications: machineData.applications || product.applications || [],
    specifications: machineData.specifications || product.specifications || {},
    downloads:
      machineData.downloads ||
      (product.pdfUrl ? [{ label: "Product PDF", url: product.pdfUrl }] : []),
    keyFeatures: product.keyFeatures || [],
    materials: (product.materials || []).map(toReference),
    industries: (product.industries || []).map(toReference),
    hierarchy: {
      category: toReference(category),
      subCategory: toReference(subCategory),
      brand: toReference(brand),
    },
  };
};

const groupById = (items, keySelector) => {
  const grouped = new Map();

  for (const item of items) {
    const key = toId(keySelector(item));
    grouped.set(key, [...(grouped.get(key) || []), item]);
  }

  return grouped;
};

export const getMachineComponentsPage = async () => {
  const categories = await Category.find({
    experience: PRODUCT_EXPERIENCES.MACHINE_COMPONENTS,
  })
    .select("name slug experience")
    .sort({ name: 1 })
    .lean();

  if (!categories.length) {
    return {
      success: true,
      data: {
        experience: PRODUCT_EXPERIENCES.MACHINE_COMPONENTS,
        sidebar: [],
        defaultProduct: null,
        products: {},
      },
    };
  }

  const subCategories = await SubCategory.find({
    category: { $in: categories.map((category) => category._id) },
  })
    .select("name slug category order")
    .sort({ order: 1, name: 1 })
    .lean();

  const brands = await Brand.find({
    subCategory: { $in: subCategories.map((subCategory) => subCategory._id) },
  })
    .select("name slug subCategory order")
    .sort({ order: 1, name: 1 })
    .lean();

  const products = await Product.find({
    brand: { $in: brands.map((brand) => brand._id) },
    "machineComponentData.isVisible": { $ne: false },
  })
    .select(
      "name slug order brand description keyFeatures applications specifications pdfUrl image machineComponentData materials industries"
    )
    .populate("materials", "name slug")
    .populate("industries", "name slug")
    .lean();

  const subCategoriesByCategory = groupById(
    sortByDisplayOrder(subCategories),
    (subCategory) => subCategory.category
  );
  const brandsBySubCategory = groupById(sortByDisplayOrder(brands), (brand) =>
    brand.subCategory
  );
  const productsByBrand = groupById(
    sortByDisplayOrder(products.map((product) => ({
      ...product,
      order: getProductOrder(product),
    }))),
    (product) => product.brand
  );

  const categoryById = new Map(categories.map((category) => [toId(category), category]));
  const subCategoryById = new Map(
    subCategories.map((subCategory) => [toId(subCategory), subCategory])
  );
  const brandById = new Map(brands.map((brand) => [toId(brand), brand]));

  const productsBySlug = {};
  const orderedProducts = sortByDisplayOrder(
    products.map((product) => ({
      ...product,
      order: getProductOrder(product),
    }))
  );

  for (const product of orderedProducts) {
    const brand = brandById.get(toId(product.brand));
    const subCategory = brand ? subCategoryById.get(toId(brand.subCategory)) : null;
    const category = subCategory ? categoryById.get(toId(subCategory.category)) : null;

    if (!brand || !subCategory || !category) {
      continue;
    }

    productsBySlug[product.slug] = toProductContent({
      product,
      brand,
      subCategory,
      category,
    });
  }

  const sidebar = categories.map((category) => ({
    ...toReference(category),
    subCategories: (subCategoriesByCategory.get(toId(category)) || []).map(
      (subCategory) => {
        const subCategoryBrands = brandsBySubCategory.get(toId(subCategory)) || [];

        if (subCategoryBrands.length <= 1) {
          const productsForSubCategory = subCategoryBrands.flatMap(
            (brand) => productsByBrand.get(toId(brand)) || []
          );

          return {
            ...toReference(subCategory),
            products: productsForSubCategory.map(toSidebarProduct),
          };
        }

        return {
          ...toReference(subCategory),
          brands: subCategoryBrands.map((brand) => ({
            ...toReference(brand),
            products: (productsByBrand.get(toId(brand)) || []).map(
              toSidebarProduct
            ),
          })),
        };
      }
    ),
  }));

  return {
    success: true,
    data: {
      experience: PRODUCT_EXPERIENCES.MACHINE_COMPONENTS,
      sidebar,
      defaultProduct: orderedProducts[0]?.slug || null,
      products: productsBySlug,
    },
  };
};
