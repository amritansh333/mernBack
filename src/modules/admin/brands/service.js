import * as repo from "./repository.js";
import { serializeBrand, serializeList } from "./serializer.js";
import { validatePagination } from "../categories/validator.js";

export const listBrands = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || "name:asc";
  const [sortField, sortDir] = sortParam.split(":");
  const sort = { [sortField || "name"]: sortDir === "desc" ? -1 : 1 };

  const q = {};
  if (req.query.search) q.name = { $regex: req.query.search, $options: "i" };

  const [total, items] = await Promise.all([repo.count(q), repo.find(q, { sort, skip: (page - 1) * limit, limit })]);
  return { items: items.map(serializeBrand), meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getBrand = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  return { item: serializeBrand(item) };
};

export const createBrand = async (payload) => {
  if (payload.slug) {
    const exists = await repo.findOne({ slug: payload.slug });
    if (exists) throw { status: 400, message: "Duplicate slug" };
  }
  const created = await repo.create(payload);
  return serializeBrand(created.toObject ? created.toObject() : created);
};

export const updateBrand = async (id, payload) => {
  if (payload.slug) {
    const existing = await repo.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (existing) throw { status: 400, message: "Duplicate slug" };
  }
  const updated = await repo.updateById(id, payload);
  if (!updated) throw { status: 404, message: "Brand not found" };
  return serializeBrand(updated);
};

export const deleteBrand = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Brand not found" };
  return removed;
};

export const bulkDelete = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) throw { status: 400, message: "ids[] required" };
  return repo.deleteMany(ids);
};

export default { listBrands, getBrand, createBrand, updateBrand, deleteBrand, bulkDelete };