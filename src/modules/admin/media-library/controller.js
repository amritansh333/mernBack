import * as service from './service.js';

export const listMedia = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const search = req.query.search || req.query.q || '';
  const result = await service.listMedia({ page, limit, search });
  return res.apiSuccess(result.rows, undefined, result.pagination);
};

export const getMedia = async (req, res) => {
  const folder = req.params.folder;
  const filename = req.params.filename;
  const item = await service.getMediaItem(folder, filename);
  if (!item) return res.apiSuccess(null);
  return res.apiSuccess(item);
};

export default { listMedia, getMedia };