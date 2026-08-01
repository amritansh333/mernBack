export const PRODUCT_BASE_PATH = "/products";

const unsafeSlugPattern = /[/?#\\\s]/;

export const normalizeRootPath = (path) => {
  if (!path || typeof path !== "string") {
    throw new Error("Root path is required to build a path");
  }

  const normalizedPath = path.trim().replace(/\/+$/, "");

  if (!normalizedPath.startsWith("/")) {
    throw new Error("Root path must start with /");
  }

  return normalizedPath;
};

export const getSlug = (entity, label) => {
  const slug = entity?.slug;

  if (!slug || typeof slug !== "string") {
    throw new Error(`${label} slug is required to build a path`);
  }

  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug || unsafeSlugPattern.test(normalizedSlug)) {
    throw new Error(`${label} slug is invalid`);
  }

  return normalizedSlug;
};

export const buildPath = (...segments) => segments.join("/");

export const buildCategoryPath = (category) =>
  buildPath(PRODUCT_BASE_PATH, getSlug(category, "Category"));

export const buildProductPath = ({
  category,
  subCategory,
  brand = null,
  product,
}) => {
  const segments = [
    PRODUCT_BASE_PATH,
    getSlug(category, "Category"),
    getSlug(subCategory, "SubCategory"),
  ];

  if (brand) {
    segments.push(getSlug(brand, "Brand"));
  }

  segments.push(getSlug(product, "Product"));

  return buildPath(...segments);
};

export default {
  buildPath,
  buildCategoryPath,
  buildProductPath,
  getSlug,
  normalizeRootPath,
  PRODUCT_BASE_PATH,
};
