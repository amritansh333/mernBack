import * as service from "./service.js";

export const listContent = async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);
  const search = req.query.search || req.query.q || "";
  const status = req.query.status || "";
  const result = await service.listContent({ page, limit, search, status });
  return res.apiSuccess(result.rows, undefined, result.pagination);
};

export const getContent = async (req, res) => {
  const id = req.params.id;
  const item = await service.getContent(id);
  return res.apiSuccess(item);
};

export const createContent = async (req, res) => {
  const data = req.body;
  const created = await service.createContent(data);
  return res.apiSuccess(created, "Created", 201);
};

export const updateContent = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const updated = await service.updateContent(id, data);
  return res.apiSuccess(updated);
};

export const deleteContent = async (req, res) => {
  const id = req.params.id;
  await service.deleteContent(id);
  return res.apiSuccess(true, "Deleted");
};

export const bulkDelete = async (req, res) => {
  const ids = req.body.ids || [];
  const deleted = await service.bulkDeleteContent(ids);
  return res.apiSuccess({ deletedCount: deleted });
};

export default {
  listContent,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  bulkDelete,
};
