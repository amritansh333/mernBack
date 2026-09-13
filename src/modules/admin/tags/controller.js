import * as service from './service.js';

export const list = async (req, res) => {
  const result = await service.list();
  return res.json({ success: true, data: result });
};

export const get = async (req, res) => {
  const { id } = req.params;
  const t = await service.getById(id);
  if (!t) return res.status(404).json({ success: false, message: 'Not found' });
  return res.json({ success: true, data: t });
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
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
  return res.json({ success: true, data: updated });
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await service.remove(id);
  return res.json({ success: true });
};
