import Brand from "../../../models/Brand.js";
import Category from "../../../models/Category.js";
import Product from "../../../models/Product.js";
import SubCategory from "../../../models/SubCategory.js";
import { PRODUCT_EXPERIENCES } from "../../../constants/productExperiences.js";
import {
  buildCategoryPath,
  buildProductPath,
} from "../../../services/PathBuilderService.js";
import { toIdString } from "../../../utils/ids.js";

const machineExperience = PRODUCT_EXPERIENCES.MACHINE_COMPONENTS;

const machineOrUnmigratedExperience = {
  $or: [
    { experience: machineExperience },
    { experience: { $exists: false } },
    { experience: null },
  ],
};

const toPlainObject = (value) => {
  if (!value) {
    return {};
  }

  if (value instanceof Map) {
    return Object.fromEntries(value);
  }

  return value;
};

const toReference = (doc) =>
  doc
    ? {
        name: doc.name,
        slug: doc.slug,
        path: doc.path,
      }
    : null;

const getProductOrder = (product) =>
  product.machineComponentData?.order ?? product.order ?? 99;

const sortByDisplayOrder = (items) =>
  [...items].sort((a, b) => {
    const orderDiff = (a.order ?? 99) - (b.order ?? 99);
    return orderDiff || a.name.localeCompare(b.name);
  });

const groupById = (items, keySelector) => {
  const grouped = new Map();

  for (const item of items) {
    const key = toIdString(keySelector(item));
    grouped.set(key, [...(grouped.get(key) || []), item]);
  }

  return grouped;
};

const hasBrand = (product) => Boolean(toIdString(product.brand));

const withGeneratedPath = ({ product, category, subCategory, brand = null }) => {
  const generatedPath = buildProductPath({
    category,
    subCategory,
    brand,
    product,
  });

  return {
    ...product,
    path: product.path || generatedPath,
  };
};

const toSidebarProduct = (product) => ({
  name: product.name,
  slug: product.slug,
  path: product.path,
  order: getProductOrder(product),
});

const toProductContent = ({ product, brand, subCategory, category }) => {
  const machineData = product.machineComponentData || {};

  return {
    name: product.name,
    slug: product.slug,
    path: product.path,
    image: product.image || "",
    description:
      machineData.description?.length > 0
        ? machineData.description
        : product.description || [],
    applications:
      machineData.applications?.length > 0
        ? machineData.applications
        : product.applications || [],
    specifications:
      machineData.specifications &&
      Object.keys(toPlainObject(machineData.specifications)).length > 0
        ? toPlainObject(machineData.specifications)
        : toPlainObject(product.specifications),
    downloads:
      machineData.downloads?.length > 0
        ? machineData.downloads
        : product.downloads?.length > 0
          ? product.downloads
          : product.pdfUrl
            ? [{ label: "Product PDF", url: product.pdfUrl }]
            : [],
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

export const getMachineComponentsPage = async () => {
  const categories = await Category.find({
    experience: machineExperience,
  })
    .select("name slug experience order")
    .sort({ order: 1, name: 1 })
    .lean();

  if (!categories.length) {
    return {
      success: true,
      data: {
        experience: machineExperience,
        sidebar: [],
        defaultProduct: null,
        products: {},
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

  const categoryById = new Map(
    categories.map((category) => [toIdString(category), category])
  );
  const subCategoryById = new Map(
    subCategories.map((subCategory) => [toIdString(subCategory), subCategory])
  );
  const brandById = new Map(brands.map((brand) => [toIdString(brand), brand]));

  const normalizedProducts = products
    .map((product) => {
      const brand = hasBrand(product) ? brandById.get(toIdString(product.brand)) : null;
      const subCategory = subCategoryById.get(
        toIdString(product.subCategory || brand?.subCategory)
      );
      const category = categoryById.get(toIdString(product.category || subCategory?.category));

      if (!subCategory || !category) {
        return null;
      }

      return withGeneratedPath({
        product: {
          ...product,
          order: getProductOrder(product),
        },
        category,
        subCategory,
        brand,
      });
    })
    .filter(Boolean);

  const subCategoriesByCategory = groupById(
    sortByDisplayOrder(subCategories),
    (subCategory) => subCategory.category
  );
  const brandsBySubCategory = groupById(sortByDisplayOrder(brands), (brand) =>
    brand.subCategory
  );
  const productsByBrand = groupById(
    sortByDisplayOrder(normalizedProducts.filter(hasBrand)),
    (product) => product.brand
  );
  const directProductsBySubCategory = groupById(
    sortByDisplayOrder(normalizedProducts.filter((product) => !hasBrand(product))),
    (product) => product.subCategory
  );

  const productsBySlug = {};
  const orderedProducts = sortByDisplayOrder(normalizedProducts);

  for (const product of orderedProducts) {
    const brand = hasBrand(product) ? brandById.get(toIdString(product.brand)) : null;
    const subCategory = subCategoryById.get(
      toIdString(product.subCategory || brand?.subCategory)
    );
    const category = categoryById.get(toIdString(product.category || subCategory?.category));

    if (!subCategory || !category) {
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
    ...toReference({
      ...category,
      path: buildCategoryPath(category),
    }),
    subCategories: (subCategoriesByCategory.get(toIdString(category)) || []).map(
      (subCategory) => {
        const subCategoryBrands = brandsBySubCategory.get(toIdString(subCategory)) || [];
        const directProducts = directProductsBySubCategory.get(toIdString(subCategory)) || [];

        if (subCategoryBrands.length <= 1) {
          const brandedProducts = subCategoryBrands.flatMap(
            (brand) => productsByBrand.get(toIdString(brand)) || []
          );

          return {
            ...toReference(subCategory),
            products: [...directProducts, ...brandedProducts].map(toSidebarProduct),
          };
        }

        return {
          ...toReference(subCategory),
          products: directProducts.map(toSidebarProduct),
          brands: subCategoryBrands.map((brand) => ({
            ...toReference(brand),
            products: (productsByBrand.get(toIdString(brand)) || []).map(
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
      experience: machineExperience,
      sidebar,
      defaultProduct: orderedProducts[0]?.slug || null,
      products: productsBySlug,
    },
  };
};

export default {
  getMachineComponentsPage,
};
