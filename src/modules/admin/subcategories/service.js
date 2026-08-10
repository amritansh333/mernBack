import * as repo from "./repository.js";
import { serializeSubcategory, serializeList } from "./serializer.js";
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
  if (req.query.category) q.category = req.query.category;
  return q;
};

export const listSubcategories = async (req) => {
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
    items: items.map(serializeSubcategory),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getSubcategory = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  // return raw item (lean result) so frontend receives all stored fields
  return { item, meta: {} };
};

export const createSubcategory = async (payload) => {
  if (payload.slug) {
    const exists = await repo.findOne({ slug: payload.slug });
    if (exists) throw { status: 400, message: "Duplicate slug" };
  }
  const created = await repo.create(payload);
  return serializeSubcategory(created.toObject ? created.toObject() : created);
};

export const updateSubcategory = async (id, payload) => {
  if (payload.slug) {
    const existing = await repo.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (existing) throw { status: 400, message: "Duplicate slug" };
  }
  const updated = await repo.updateById(id, payload);
  if (!updated) throw { status: 404, message: "Subcategory not found" };
  return serializeSubcategory(updated);
};

export const deleteSubcategory = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Subcategory not found" };
  return removed;
};

export const bulkDelete = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw { status: 400, message: "ids[] required" };
  return repo.deleteMany(ids);
};

export default {
  listSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  bulkDelete,
};
