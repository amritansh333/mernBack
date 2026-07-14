const PRODUCT_BASE_PATH = "/products";

const getSlug = (entity, label) => {
  const slug = entity?.slug;

  if (!slug || typeof slug !== "string") {
    throw new Error(`${label} slug is required to build a path`);
  }

  return slug.trim().toLowerCase();
};

export const buildCategoryPath = (category) =>
  `${PRODUCT_BASE_PATH}/${getSlug(category, "Category")}`;

export const buildProductPath = ({ category, subCategory, brand = null, product }) => {
  const segments = [
    PRODUCT_BASE_PATH,
    getSlug(category, "Category"),
    getSlug(subCategory, "SubCategory"),
  ];

  if (brand) {
    segments.push(getSlug(brand, "Brand"));
  }

  segments.push(getSlug(product, "Product"));

  return segments.join("/");
};

export default {
  buildCategoryPath,
  buildProductPath,
};
