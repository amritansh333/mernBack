import * as service from "./service.js";

export const list = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const result = await service.listAll({ page: Number(page), limit: Number(limit) });
  return res.json({ success: true, message: "ok", data: result });
};

export const get = async (req, res) => {
  const { id } = req.params;
  const item = await service.getById(id);
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: item });
};

export const create = async (req, res) => {
  const payload = req.body;
  const created = await service.create(payload);
  return res.status(201).json({ success: true, data: created });
};

export const update = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updated = await service.update(id, payload);
  if (!updated) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: updated });
};

export const publish = async (req, res) => {
  const { id } = req.params;
  const published = await service.publish(id);
  if (!published) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: published });
};

export const unpublish = async (req, res) => {
  const { id } = req.params;
  const updated = await service.unpublish(id);
  if (!updated) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: updated });
};

export const feature = async (req, res) => {
  const { id } = req.params;
  const { featured } = req.body;
  const updated = await service.setFeatured(id, !!featured);
  if (!updated) return res.status(404).json({ success: false, message: "Not found" });
  return res.json({ success: true, data: updated });
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await service.remove(id);
  return res.json({ success: true });
};
