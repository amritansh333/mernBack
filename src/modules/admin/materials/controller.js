import * as service from "./service.js";

export const listMaterials = async (req, res) => {
  const { items, meta } = await service.listMaterials(req);
  return res.apiSuccess(items, "Materials fetched", meta);
};

export const getMaterial = async (req, res) => {
  const data = await service.getMaterial(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Material not found");
  return res.apiSuccess({ ...data.item, linkedProducts: data.linkedProducts }, "Material fetched");
};

export const createMaterial = async (req, res) => {
  const doc = await service.createMaterial(req.body || {});
  return res.apiSuccess(doc, "Material created");
};

export const updateMaterial = async (req, res) => {
  const doc = await service.updateMaterial(req.params.id, req.body || {});
  return res.apiSuccess(doc, "Material updated");
};

export const deleteMaterial = async (req, res) => {
  const removed = await service.deleteMaterial(req.params.id);
  return res.apiSuccess(removed, "Material deleted");
};

export const bulkDelete = async (req, res) => {
  const result = await service.bulkDelete(Array.isArray(req.body.ids) ? req.body.ids : []);
  return res.apiSuccess(result, "Materials deleted");
};

export default { listMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial, bulkDelete };
