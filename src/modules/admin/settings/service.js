import * as repo from "./repository.js";
import { serializeSetting, serializeList } from "./serializer.js";
import { validatePagination } from "../categories/validator.js";

export const listSettings = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || "order:asc";
  const [sortField, sortDir] = sortParam.split(":");
  const sort = { [sortField || "order"]: sortDir === "desc" ? -1 : 1 };

  const q = {};
  if (req.query.search) {
    const s = req.query.search;
    q.$or = [{ name: { $regex: s, $options: "i" } }, { key: { $regex: s, $options: "i" } }, { description: { $regex: s, $options: "i" } }];
  }

  if (req.query.group) q.group = req.query.group;
  if (req.query.isVisible !== undefined) q.isVisible = req.query.isVisible === "true" || req.query.isVisible === true;

  const [total, items] = await Promise.all([
    repo.count(q),
    repo.find(q, { sort, skip: (page - 1) * limit, limit }),
  ]);

  return { items: items.map(serializeSetting), meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getSetting = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  return { item: serializeSetting(item) };
};

export const createSetting = async (payload) => {
  if (payload.key) {
    const exists = await repo.findOne({ key: payload.key });
    if (exists) throw { status: 400, message: "Duplicate key" };
  }
  const created = await repo.create(payload);
  return serializeSetting(created.toObject ? created.toObject() : created);
};

export const updateSetting = async (id, payload) => {
  if (payload.key) {
    const existing = await repo.findOne({ key: payload.key, _id: { $ne: id } });
    if (existing) throw { status: 400, message: "Duplicate key" };
  }
  const updated = await repo.updateById(id, payload);
  if (!updated) throw { status: 404, message: "Setting not found" };
  return serializeSetting(updated);
};

export const deleteSetting = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Setting not found" };
  return removed;
};

export const bulkDelete = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) throw { status: 400, message: "ids[] required" };
  return repo.deleteMany(ids);
};

export default { listSettings, getSetting, createSetting, updateSetting, deleteSetting, bulkDelete };
