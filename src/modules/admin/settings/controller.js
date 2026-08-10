import * as service from "./service.js";

export const listSettings = async (req, res) => {
  const { items, meta } = await service.listSettings(req);
  return res.apiSuccess(items, "Settings fetched", meta);
};

export const getSetting = async (req, res) => {
  const data = await service.getSetting(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Setting not found");
  return res.apiSuccess(data.item, "Setting fetched");
};

export const createSetting = async (req, res) => {
  const doc = await service.createSetting(req.body || {});
  return res.apiSuccess(doc, "Setting created");
};

export const updateSetting = async (req, res) => {
  const doc = await service.updateSetting(req.params.id, req.body || {});
  return res.apiSuccess(doc, "Setting updated");
};

export const deleteSetting = async (req, res) => {
  const removed = await service.deleteSetting(req.params.id);
  return res.apiSuccess(removed, "Setting deleted");
};

export const bulkDelete = async (req, res) => {
  const result = await service.bulkDelete(
    Array.isArray(req.body.ids) ? req.body.ids : [],
  );
  return res.apiSuccess(result, "Settings deleted");
};

export default {
  listSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  bulkDelete,
};
