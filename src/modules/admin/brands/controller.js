import * as service from "./service.js";

export const listBrands = async (req, res) => {
  const { items, meta } = await service.listBrands(req);
  return res.apiSuccess(items, "Brands fetched", meta);
};

export const getBrand = async (req, res) => {
  const data = await service.getBrand(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Brand not found");
  return res.apiSuccess(data.item, "Brand fetched");
};

export const createBrand = async (req, res) => {
  const doc = await service.createBrand(req.body || {});
  return res.apiSuccess(doc, "Brand created");
};

export const updateBrand = async (req, res) => {
  const doc = await service.updateBrand(req.params.id, req.body || {});
  return res.apiSuccess(doc, "Brand updated");
};

export const deleteBrand = async (req, res) => {
  const removed = await service.deleteBrand(req.params.id);
  return res.apiSuccess(removed, "Brand deleted");
};

export const bulkDelete = async (req, res) => {
  const result = await service.bulkDelete(Array.isArray(req.body.ids) ? req.body.ids : []);
  return res.apiSuccess(result, "Brands deleted");
};

export default { listBrands, getBrand, createBrand, updateBrand, deleteBrand, bulkDelete };
