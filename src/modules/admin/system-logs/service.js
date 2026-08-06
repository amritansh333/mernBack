import * as repo from './repository.js';
import { serializeList, serializeLog } from './serializer.js';
import { validatePagination } from './validator.js';
import mongoose from 'mongoose';

export const listLogs = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || 'timestamp:desc';
  const [sortField, sortDir] = sortParam.split(':');
  const sort = { [sortField || 'timestamp']: sortDir === 'asc' ? 1 : -1 };

  const q = {};
  if (req.query.search) {
    const regex = { $regex: req.query.search, $options: 'i' };
    q.$or = [{ message: regex }, { 'meta.user': regex }, { source: regex }];
  }

  if (req.query.level) q.level = req.query.level;

  if (req.query.from || req.query.to) {
    q.timestamp = {};
    if (req.query.from) q.timestamp.$gte = new Date(req.query.from);
    if (req.query.to) q.timestamp.$lte = new Date(req.query.to);
  }

  const [total, items] = await Promise.all([
    repo.count(q),
    repo.find(q, { sort, skip: (page - 1) * limit, limit }),
  ]);

  return { items: serializeList(items), meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getLog = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const item = await repo.findById(id);
  if (!item) return null;
  return { item: serializeLog(item) };
};

export const deleteLog = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw { status: 400, message: 'Invalid id' };
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: 'Log not found' };
  return removed;
};

export default { listLogs, getLog, deleteLog };
