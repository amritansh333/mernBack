import * as service from "./service.js";

export const listProducts = async (req, res) => {
  const { items, meta } = await service.listProducts(req);
  return res.apiSuccess(items, "Products fetched", meta);
};

export const getProduct = async (req, res) => {
  const data = await service.getProduct(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Product not found");
  return res.apiSuccess({ ...data.item, enquiries: data.enquiries }, "Product fetched");
};

export const createProduct = async (req, res) => {
  const doc = await service.createProduct(req.body || {}, req.file);
  return res.apiSuccess(doc, "Product created");
};

export const updateProduct = async (req, res) => {
  const doc = await service.updateProduct(req.params.id, req.body || {}, req.file);
  return res.apiSuccess(doc, "Product updated");
};

export const deleteProduct = async (req, res) => {
  const removed = await service.deleteProduct(req.params.id);
  return res.apiSuccess(removed, "Product deleted");
};

export const bulkDelete = async (req, res) => {
  const result = await service.bulkDelete(Array.isArray(req.body.ids) ? req.body.ids : []);
  return res.apiSuccess(result, "Products deleted");
};

export const bulkStatusUpdate = async (req, res) => {
  const result = await service.bulkStatusUpdate(Array.isArray(req.body.ids) ? req.body.ids : [], req.body.isVisible);
  return res.apiSuccess(result, "Products updated");
};

export default {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDelete,
  bulkStatusUpdate,
};
