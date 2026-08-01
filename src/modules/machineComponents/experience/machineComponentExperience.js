import { createMachineComponentRoutingStrategy } from "../routing/machineComponentRouting.js";
import { toIdString } from "../../../utils/ids.js";

const DEFAULT_ORDER = 99;

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
  product.machineComponentData?.order ?? product.order ?? DEFAULT_ORDER;

const sortByDisplayOrder = (items) =>
  [...items].sort((a, b) => {
    const orderDiff = (a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER);
    return orderDiff || a.name.localeCompare(b.name);
  });

const sortRecordsByProductOrder = (records) =>
  [...records].sort((a, b) => {
    const orderDiff =
      (a.product.order ?? DEFAULT_ORDER) - (b.product.order ?? DEFAULT_ORDER);
    return orderDiff || a.product.name.localeCompare(b.product.name);
  });

const groupById = (items, keySelector) => {
  const grouped = new Map();

  for (const item of items) {
    const key = toIdString(keySelector(item));
    const group = grouped.get(key);

    if (group) {
      group.push(item);
    } else {
      grouped.set(key, [item]);
    }
  }

  return grouped;
};

const hasBrand = (product) => Boolean(toIdString(product.brand));

const toSidebarProduct = (product) => ({
  name: product.name,
  slug: product.slug,
  path: product.path,
  order: getProductOrder(product),
});

const toProductContent = ({ product, brand, subCategory, category }) => {
  const machineData = product.machineComponentData || {};
  const machineSpecifications = toPlainObject(machineData.specifications);
  const productSpecifications = toPlainObject(product.specifications);

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
      Object.keys(machineSpecifications).length > 0
        ? machineSpecifications
        : productSpecifications,
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

const buildSubcategoryResponse = ({
  subCategory,
  products,
  category,
  routingStrategy,
}) => ({
  name: subCategory.name,
  slug: subCategory.slug,
  path: routingStrategy.buildSubCategoryPath({ subCategory }),
  image: subCategory.image || "",
  heroTitle: subCategory.heroTitle || subCategory.name,
  heroSubtitle: subCategory.heroSubtitle || "",
  description: subCategory.description || [],
  applications: subCategory.applications || [],
  technicalCharacteristics:
    subCategory.technicalCharacteristics || [],
  specifications: toPlainObject(subCategory.specifications),
  downloads: subCategory.downloads || [],
  seo: subCategory.seo || {},
  hierarchy: {
    category: toReference(category),
    subCategory: toReference(subCategory),
  },
  products: products.map((product) => ({
  name: product.name,
  slug: product.slug,
  path: product.path,
  image: product.image,

  description:
    Array.isArray(product.description)
      ? product.description
      : product.description
      ? [product.description]
      : [],

  keyFeatures: product.keyFeatures || [],
})),
});

export const createMachineComponentExperience = ({ rootPath }) => {
  const routingStrategy = createMachineComponentRoutingStrategy({ rootPath });

  const resolveCategory = ({ product, subCategory, categoryById }) =>
    categoryById.get(toIdString(product.category || subCategory?.category)) || null;

  const normalizeProduct = ({ product, brandById, subCategoryById, categoryById }) => {
    const brand = hasBrand(product) ? brandById.get(toIdString(product.brand)) : null;
    const subCategory =
      subCategoryById.get(toIdString(product.subCategory || brand?.subCategory)) ||
      null;
    const category = resolveCategory({ product, subCategory, categoryById });

    if (!category) {
      return null;
    }

    return {
      product: {
        ...product,
        order: getProductOrder(product),
        path: routingStrategy.buildProductPath({ subCategory, product }),
      },
      brand,
      subCategory,
      category,
    };
  };

  const generateSidebar = ({
    categories,
    subCategoriesByCategory,
    brandsBySubCategory,
    productsByBrand,
    directProductsBySubCategory,
  }) =>
    categories.map((category) => ({
      ...toReference({
        ...category,
        path: routingStrategy.buildCategoryPath({ category }),
      }),
      subCategories: (subCategoriesByCategory.get(toIdString(category)) || []).map(
        (subCategory) => {
          const subCategoryBrands =
            brandsBySubCategory.get(toIdString(subCategory)) || [];
          const directProducts =
            directProductsBySubCategory.get(toIdString(subCategory)) || [];

          if (subCategoryBrands.length <= 1) {
            const brandedProducts = subCategoryBrands.flatMap(
              (brand) => productsByBrand.get(toIdString(brand)) || []
            );

            return {
  ...toReference({
    ...subCategory,
    path: routingStrategy.buildSubCategoryPath({
      subCategory,
    }),
  }),
  products: [...directProducts, ...brandedProducts].map(
    toSidebarProduct
  ),
};
          }

          return {
  ...toReference({
    ...subCategory,
    path: routingStrategy.buildSubCategoryPath({
      subCategory,
    }),
  }),
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

  const buildCatalogResponse = ({ categories, subCategories, brands, products }) => {
    if (!categories.length) {
      return {
        sidebar: [],
        defaultProduct: null,
        products: {},
      };
    }

    const categoryById = new Map(
      categories.map((category) => [toIdString(category), category])
    );
    const subCategoryById = new Map(
      subCategories.map((subCategory) => [toIdString(subCategory), subCategory])
    );
    const brandById = new Map(brands.map((brand) => [toIdString(brand), brand]));

    const normalizedRecords = products
      .map((product) =>
        normalizeProduct({
          product,
          brandById,
          subCategoryById,
          categoryById,
        })
      )
      .filter(Boolean);
    const normalizedProducts = normalizedRecords.map((record) => record.product);

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
    const orderedRecords = sortRecordsByProductOrder(normalizedRecords);

    for (const record of orderedRecords) {
      productsBySlug[record.product.slug] = toProductContent(record);
    }

    return {
      sidebar: generateSidebar({
        categories,
        subCategoriesByCategory,
        brandsBySubCategory,
        productsByBrand,
        directProductsBySubCategory,
      }),
      defaultProduct: orderedProducts[0]?.slug || null,
      products: productsBySlug,
    };
  };

  return Object.freeze({
  ...routingStrategy,
  resolveCategory,
  normalizeProduct,
  generateSidebar,
  buildCatalogResponse,
  buildSubcategoryResponse,
});
};

export default {
  createMachineComponentExperience,
};
