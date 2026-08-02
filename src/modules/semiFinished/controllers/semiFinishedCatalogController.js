import * as semiFinishedCatalogService from "../services/semiFinishedCatalogService.js";

export const getAllCategories = async (req, res) => {
  const categories = await semiFinishedCatalogService.getAllCategories();
  res.json(categories);
};

export const getSemiFinishedCategories = async (req, res) => {
  const categories =
    await semiFinishedCatalogService.getSemiFinishedCategories();
  res.json(categories);
};

export const getCategoryBySlug = async (req, res) => {
  const category = await semiFinishedCatalogService.getCategoryBySlug(
    req.params.slug,
  );

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.json(category);
};

export const getSubCategoriesByCategoryId = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ message: "Category ID required" });
  }

  const subCategories =
    await semiFinishedCatalogService.getSubCategoriesByCategoryId(category);

  return res.json(subCategories);
};

export const getSubCategoriesByCategorySlug = async (req, res) => {
  const result =
    await semiFinishedCatalogService.getSubCategoriesByCategorySlug(
      req.params.slug,
    );

  if (!result) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.json(result.subcategories);
};

export const getBrandsBySubCategoryId = async (req, res) => {
  const { subcategory } = req.query;

  if (!subcategory) {
    return res.status(400).json({ message: "SubCategory ID required" });
  }

  const brands =
    await semiFinishedCatalogService.getBrandsBySubCategoryId(subcategory);

  return res.json(brands);
};

export const getBrandsBySubCategorySlug = async (req, res) => {
  const result = await semiFinishedCatalogService.getBrandsBySubCategorySlug(
    req.params.slug,
  );

  if (!result) {
    return res.status(404).json({ message: "SubCategory not found" });
  }

  return res.json({
    subcategory: result.subcategory,
    brands: result.brands,
  });
};

export const getProductsByBrandId = async (req, res) => {
  const { brand } = req.query;

  if (!brand) {
    return res.status(400).json({ message: "Brand ID required" });
  }

  const products = await semiFinishedCatalogService.getProductsByBrandId(brand);

  return res.json(products);
};

export const getProductsByBrandSlug = async (req, res) => {
  const result = await semiFinishedCatalogService.getProductsByBrandSlug(
    req.params.slug,
  );

  if (!result) {
    return res.status(404).json({ message: "Brand not found" });
  }

  return res.json({
    brand: result.brand,
    products: result.products,
  });
};

export const getProductBySlug = async (req, res) => {
  const result = await semiFinishedCatalogService.getProductBySlug(
    req.params.slug,
  );

  if (!result) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({
    brand: result.brand,
    product: result.product,
  });
};
