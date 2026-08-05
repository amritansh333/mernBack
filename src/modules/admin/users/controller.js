import * as service from './service.js';

export const listUsers = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const search = req.query.search || '';
  const status = req.query.status || '';

  const result = await service.listUsers({ page, limit, search, status });
  res.json({ success: true, message: 'OK', data: result.rows, pagination: result.pagination });
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const item = await service.getUser(id);
  res.json({ success: true, message: 'OK', data: item });
};

export const createUser = async (req, res) => {
  const data = req.body;
  const created = await service.createUser(data);
  res.status(201).json({ success: true, message: 'Created', data: created });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const updated = await service.updateUser(id, data);
  res.json({ success: true, message: 'OK', data: updated });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await service.deleteUser(id);
  res.json({ success: true, message: 'Deleted', data: true });
};

export const bulkDelete = async (req, res) => {
  const { ids } = req.body;
  const deleted = await service.bulkDeleteUsers(ids || []);
  res.json({ success: true, message: 'Deleted', data: deleted });
};

export default { listUsers, getUser, createUser, updateUser, deleteUser, bulkDelete };