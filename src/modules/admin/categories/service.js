import Category from "../../../models/Category.js";
import Product from "../../../models/Product.js";
import * as repo from "./repository.js";
import * as productsRepo from "../products/repository.js";
import { serializeCategory, serializeList } from "./serializer.js";
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
  if (req.query.isVisible !== undefined) q.isVisible = req.query.isVisible === "true";
  return q;
};

export const listCategories = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || "order:asc";
  const [sortField, sortDir] = sortParam.split(":");
  const sort = { [sortField || "order"]: sortDir === "desc" ? -1 : 1 };

  const query = buildQueryFromReq(req);
  const [total, items] = await Promise.all([repo.count(query), repo.find(query, { sort, skip: (page - 1) * limit, limit })]);

  const itemsWithMeta = await Promise.all(
    items.map(async (item) => {
      const productCount = await productsRepo.count({ category: item._id });
      const subcategories = await repo.find({ parent: item._id });
      return { ...item, productCount, subcategories };
    }),
  );

  return { items: itemsWithMeta.map(serializeCategory), meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getCategory = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  const productCount = await Product.countDocuments({ category: item._id });
  const subcategories = await Category.find({ parent: item._id }).lean();
  return { item: serializeCategory(item), meta: { productCount, subcategories } };
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
    const existing = await repo.findOne({ slug: payload.slug, _id: { $ne: id } });
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
  if (!Array.isArray(ids) || ids.length === 0) throw { status: 400, message: "ids[] required" };
  return repo.deleteMany(ids);
};

export default { listCategories, getCategory, createCategory, updateCategory, deleteCategory, bulkDelete };
