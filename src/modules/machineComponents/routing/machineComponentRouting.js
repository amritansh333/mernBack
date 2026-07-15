import {
  buildPath,
  getSlug,
  normalizeRootPath,
} from "../../../services/PathBuilderService.js";

export const createMachineComponentRoutingStrategy = ({ rootPath }) => {
  const normalizedRootPath = normalizeRootPath(rootPath);

  const buildCategoryPath = () => normalizedRootPath;

  const buildSubCategoryPath = ({ subCategory }) =>
    buildPath(normalizedRootPath, getSlug(subCategory, "SubCategory"));

  const buildProductPath = ({ subCategory = null, product }) => {
  // Special case: category landing page
  if (product?.slug === "thermoplastics-machine-components") {
    return normalizedRootPath;
  }

  const basePath = subCategory
    ? buildSubCategoryPath({ subCategory })
    : normalizedRootPath;

  return buildPath(basePath, getSlug(product, "Product"));
};

  return Object.freeze({
    type: "machine_component_hierarchy",
    rootPath: normalizedRootPath,
    buildCategoryPath,
    buildSubCategoryPath,
    buildProductPath,
    generateCanonicalUrl: buildProductPath,
  });
};

export default {
  createMachineComponentRoutingStrategy,
};
