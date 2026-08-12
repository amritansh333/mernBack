import Product from "../../../models/Product.js";
import * as repo from "./repository.js";
import * as productsRepo from "../products/repository.js";
import { serializeMaterial, serializeList } from "./serializer.js";
import { validatePagination } from "./validator.js";

export const listMaterials = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || "name:asc";
  const [sortField, sortDir] = sortParam.split(":");
  const sort = { [sortField || "name"]: sortDir === "desc" ? -1 : 1 };

  const q = {};
  if (req.query.search) q.name = { $regex: req.query.search, $options: "i" };

  const [total, items] = await Promise.all([
    repo.count(q),
    repo.find(q, { sort, skip: (page - 1) * limit, limit }),
  ]);

  const withMeta = await Promise.all(
    items.map(async (m) => {
      const productCount = await productsRepo.count({ materials: m._id });
      return { ...m, productCount };
    }),
  );

  return {
    items: withMeta.map(serializeMaterial),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getMaterial = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  const linkedProducts = await Product.find({ materials: item._id })
    .limit(20)
    .lean();
  return { item: serializeMaterial(item), linkedProducts };
};

export const createMaterial = async (payload) => {
  if (payload.slug) {
    const exists = await repo.findOne({ slug: payload.slug });
    if (exists) throw { status: 400, message: "Duplicate slug" };
  }
  const created = await repo.create(payload);
  return serializeMaterial(created.toObject ? created.toObject() : created);
};

export const updateMaterial = async (id, payload) => {
  if (payload.slug) {
    const existing = await repo.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (existing) throw { status: 400, message: "Duplicate slug" };
  }
  const updated = await repo.updateById(id, payload);
  if (!updated) throw { status: 404, message: "Material not found" };
  return serializeMaterial(updated);
};

export const deleteMaterial = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Material not found" };
  return removed;
};

export const bulkDelete = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw { status: 400, message: "ids[] required" };
  return repo.deleteMany(ids);
};

export default {
  listMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  bulkDelete,
};
