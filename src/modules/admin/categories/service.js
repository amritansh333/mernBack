import * as repo from "./repository.js";
import {
  serializeCategory,
  serializeCategoryDetail,
  serializeList,
} from "./serializer.js";
import { validatePagination } from "./validator.js";

const buildQueryFromReq = (req) => {
  const q = {};
  if (req.query.search) {
    q.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { slug: { $regex: req.query.search, $options: "i" } },
    ];
  }
  if (req.query.experience) q.experience = req.query.experience;
  if (req.query.isVisible !== undefined)
    q.isVisible = req.query.isVisible === "true";
  return q;
};

export const listCategories = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || "order:asc";
  const [sortField, sortDir] = sortParam.split(":");
  const sort = { [sortField || "order"]: sortDir === "desc" ? -1 : 1 };

  const query = buildQueryFromReq(req);
  const [total, items] = await Promise.all([
    repo.count(query),
    repo.find(query, { sort, skip: (page - 1) * limit, limit }),
  ]);

  return {
    items: items.map(serializeCategory),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getCategory = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  return { item: serializeCategoryDetail(item) };
};

export const createCategory = async (payload) => {
  if (payload.slug) {
    const exists = await repo.findOne({ slug: payload.slug });
    if (exists) throw { status: 400, message: "Duplicate slug" };
  }
  const created = await repo.create(payload);
  return serializeCategory(created.toObject ? created.toObject() : created);
};

export const updateCategory = async (id, payload) => {
  if (payload.slug) {
    const existing = await repo.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (existing) throw { status: 400, message: "Duplicate slug" };
  }
  const updated = await repo.updateById(id, payload);
  if (!updated) throw { status: 404, message: "Category not found" };
  return serializeCategory(updated);
};

export const deleteCategory = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Category not found" };
  return removed;
};

export const bulkDelete = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw { status: 400, message: "ids[] required" };
  return repo.deleteMany(ids);
};

export default {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDelete,
};
