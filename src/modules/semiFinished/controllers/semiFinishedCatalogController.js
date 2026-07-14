import * as semiFinishedCatalogService from "../services/semiFinishedCatalogService.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await semiFinishedCatalogService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSemiFinishedCategories = async (req, res) => {
  try {
    const categories =
      await semiFinishedCatalogService.getSemiFinishedCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await semiFinishedCatalogService.getCategoryBySlug(
      req.params.slug
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubCategoriesByCategoryId = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category ID required" });
    }

    const subCategories =
      await semiFinishedCatalogService.getSubCategoriesByCategoryId(category);

    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubCategoriesByCategorySlug = async (req, res) => {
  try {
    const result =
      await semiFinishedCatalogService.getSubCategoriesByCategorySlug(
        req.params.slug
      );

    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result.subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBrandsBySubCategoryId = async (req, res) => {
  try {
    const { subcategory } = req.query;

    if (!subcategory) {
      return res.status(400).json({ message: "SubCategory ID required" });
    }

    const brands =
      await semiFinishedCatalogService.getBrandsBySubCategoryId(subcategory);

    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBrandsBySubCategorySlug = async (req, res) => {
  try {
    const result =
      await semiFinishedCatalogService.getBrandsBySubCategorySlug(
        req.params.slug
      );

    if (!result) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.json(result.brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByBrandId = async (req, res) => {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({ message: "Brand ID required" });
    }

    const products = await semiFinishedCatalogService.getProductsByBrandId(
      brand
    );

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByBrandSlug = async (req, res) => {
  try {
    const result = await semiFinishedCatalogService.getProductsByBrandSlug(
      req.params.slug
    );

    if (!result) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json(result.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await semiFinishedCatalogService.getProductBySlug(
      req.params.slug
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
