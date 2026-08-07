import * as service from "./service.js";

export const listSubcategories = async (req, res) => {
  const { items, meta } = await service.listSubcategories(req);
  return res.apiSuccess(items, "Subcategories fetched", meta);
};

export const getSubcategory = async (req, res) => {
  const data = await service.getSubcategory(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Subcategory not found");
  return res.apiSuccess(data.item, "Subcategory fetched");
};

export const createSubcategory = async (req, res) => {
  const doc = await service.createSubcategory(req.body || {});
  return res.apiSuccess(doc, "Subcategory created");
};

export const updateSubcategory = async (req, res) => {
  const doc = await service.updateSubcategory(req.params.id, req.body || {});
  return res.apiSuccess(doc, "Subcategory updated");
};

export const deleteSubcategory = async (req, res) => {
  const removed = await service.deleteSubcategory(req.params.id);
  return res.apiSuccess(removed, "Subcategory deleted");
};

export const bulkDelete = async (req, res) => {
  const result = await service.bulkDelete(Array.isArray(req.body.ids) ? req.body.ids : []);
  return res.apiSuccess(result, "Subcategories deleted");
};

export default {
  listSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  bulkDelete,
};
