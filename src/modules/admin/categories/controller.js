import * as service from "./service.js";

export const listCategories = async (req, res) => {
  const { items, meta } = await service.listCategories(req);
  return res.apiSuccess(items, "Categories fetched", meta);
};

export const getCategory = async (req, res) => {
  const data = await service.getCategory(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Category not found");
  return res.apiSuccess({ ...data.item, ...data.meta }, "Category fetched");
};

export const createCategory = async (req, res) => {
  const doc = await service.createCategory(req.body || {});
  return res.apiSuccess(doc, "Category created");
};

export const updateCategory = async (req, res) => {
  const doc = await service.updateCategory(req.params.id, req.body || {});
  return res.apiSuccess(doc, "Category updated");
};

export const deleteCategory = async (req, res) => {
  const removed = await service.deleteCategory(req.params.id);
  return res.apiSuccess(removed, "Category deleted");
};

export const bulkDelete = async (req, res) => {
  const result = await service.bulkDelete(
    Array.isArray(req.body.ids) ? req.body.ids : [],
  );
  return res.apiSuccess(result, "Categories deleted");
};

export default {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDelete,
};
