import * as service from "./service.js";

export const listDownloads = async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);
  const search = req.query.search || req.query.q || "";
  const result = await service.listDownloads({ page, limit, search });
  return res.apiSuccess(result.rows, undefined, result.pagination);
};

export const getDownload = async (req, res) => {
  const id = req.params.id;
  const item = await service.getDownload(id);
  return res.apiSuccess(item);
};

export default { listDownloads, getDownload };
