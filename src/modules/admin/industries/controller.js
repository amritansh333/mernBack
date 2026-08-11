import * as service from "./service.js";

export const listIndustries = async (req, res) => {
  const { items, meta } = await service.listIndustries(req);
  return res.apiSuccess(items, "Industries fetched", meta);
};

export const getIndustry = async (req, res) => {
  const data = await service.getIndustry(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Industry not found");
  return res.apiSuccess({ ...data.item, ...data.meta }, "Industry fetched");
};

export const createIndustry = async (req, res) => {
  const doc = await service.createIndustry(req.body || {});
  return res.apiSuccess(doc, "Industry created");
};

export const updateIndustry = async (req, res) => {
  const doc = await service.updateIndustry(req.params.id, req.body || {});
  return res.apiSuccess(doc, "Industry updated");
};

export const deleteIndustry = async (req, res) => {
  const removed = await service.deleteIndustry(req.params.id);
  return res.apiSuccess(removed, "Industry deleted");
};

export const bulkDelete = async (req, res) => {
  const payload = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const result = await service.bulkDelete(payload);
  return res.apiSuccess(result, "Industries deleted");
};

export default {
  listIndustries,
  getIndustry,
  createIndustry,
  updateIndustry,
  deleteIndustry,
  bulkDelete,
};
