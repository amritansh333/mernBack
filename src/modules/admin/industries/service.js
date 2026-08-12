import Product from "../../../models/Product.js";
import * as repo from "./repository.js";
import { serializeIndustry } from "./serializer.js";
import { normalizeIndustryPayload, validatePagination } from "./validator.js";

const buildQueryFromReq = (req) => {
  const query = {};
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { slug: { $regex: req.query.search, $options: "i" } },
    ];
  }
  return query;
};

export const listIndustries = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || "name:asc";
  const [sortField, sortDir] = sortParam.split(":");
  const sort = { [sortField || "name"]: sortDir === "desc" ? -1 : 1 };

  const query = buildQueryFromReq(req);
  const [total, items] = await Promise.all([
    repo.count(query),
    repo.find(query, { sort, skip: (page - 1) * limit, limit }),
  ]);

  return {
    items: items.map(serializeIndustry),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getIndustry = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  return { item: serializeIndustry(item) };
};

export const createIndustry = async (payload = {}) => {
  const normalized = normalizeIndustryPayload(payload);

  const duplicateName = await repo.findOne({ name: normalized.name });
  if (duplicateName) {
    throw { status: 400, message: "Duplicate industry name" };
  }

  const duplicateSlug = await repo.findOne({ slug: normalized.slug });
  if (duplicateSlug) {
    throw { status: 400, message: "Duplicate industry slug" };
  }

  const created = await repo.create(normalized);
  return serializeIndustry(created.toObject ? created.toObject() : created);
};

export const updateIndustry = async (id, payload = {}) => {
  const existing = await repo.findById(id);
  if (!existing) {
    throw { status: 404, message: "Industry not found" };
  }

  const merged = { ...existing, ...payload };
  const normalized = normalizeIndustryPayload(merged);

  const duplicateName = await repo.findOne({
    name: normalized.name,
    _id: { $ne: id },
  });
  if (duplicateName) {
    throw { status: 400, message: "Duplicate industry name" };
  }

  const duplicateSlug = await repo.findOne({
    slug: normalized.slug,
    _id: { $ne: id },
  });
  if (duplicateSlug) {
    throw { status: 400, message: "Duplicate industry slug" };
  }

  const updated = await repo.updateById(id, normalized);
  if (!updated) {
    throw { status: 404, message: "Industry not found" };
  }

  return serializeIndustry(updated);
};

export const deleteIndustry = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) {
    throw { status: 404, message: "Industry not found" };
  }

  const productCount = await Product.countDocuments({
    industries: existing._id,
  });
  if (productCount > 0) {
    throw {
      status: 400,
      message:
        "Industry is currently associated with products and cannot be deleted",
    };
  }

  const removed = await repo.deleteById(id);
  if (!removed) {
    throw { status: 404, message: "Industry not found" };
  }

  return removed;
};

export const bulkDelete = async (ids = []) => {
  const uniqueIds = [
    ...new Set((Array.isArray(ids) ? ids : []).filter(Boolean)),
  ];
  if (uniqueIds.length === 0) return { deletedCount: 0, ids: [] };

  const items = await repo.find({ _id: { $in: uniqueIds } });
  const blockedIds = [];

  for (const item of items) {
    const productCount = await Product.countDocuments({ industries: item._id });
    if (productCount > 0) blockedIds.push(String(item._id));
  }

  if (blockedIds.length > 0) {
    throw {
      status: 400,
      message:
        "One or more industries are associated with products and cannot be deleted",
    };
  }

  const result = await repo.deleteMany(uniqueIds);
  return {
    deletedCount: result?.deletedCount ?? uniqueIds.length,
    ids: uniqueIds,
  };
};

export default {
  listIndustries,
  getIndustry,
  createIndustry,
  updateIndustry,
  deleteIndustry,
  bulkDelete,
};
