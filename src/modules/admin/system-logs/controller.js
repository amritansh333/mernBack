import * as service from "./service.js";

export const listLogs = async (req, res) => {
  const { items, meta } = await service.listLogs(req);
  return res.apiSuccess(items, "System logs fetched", meta);
};

export const getLog = async (req, res) => {
  const data = await service.getLog(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Log not found");
  return res.apiSuccess(data.item, "Log fetched");
};

export const deleteLog = async (req, res) => {
  const removed = await service.deleteLog(req.params.id);
  return res.apiSuccess(removed, "Log deleted");
};

export default { listLogs, getLog, deleteLog };
