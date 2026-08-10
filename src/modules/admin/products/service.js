import * as repo from "./repository.js";
import { serializeProduct, serializeList } from "./serializer.js";
import { validatePagination, validateSort } from "./validator.js";

const buildQueryFromReq = (req) => {
  const q = {};
  const {
    search,
    brand,
    category,
    subCategory,
    material,
    experience,
    isVisible,
  } = req.query;
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { "seo.metaTitle": { $regex: search, $options: "i" } },
      { description: { $elemMatch: { $regex: search, $options: "i" } } },
    ];
  }
  if (brand) q.brand = brand;
  if (category) q.category = category;
  if (subCategory) q.subCategory = subCategory;
  if (experience) q.experience = experience;
  if (isVisible !== undefined) q.isVisible = isVisible === "true";
  if (material) q.materials = { $in: [material] };
  return q;
};

export const listProducts = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortObj = validateSort(req.query.sort, "createdAt:desc");
  const sort = { [sortObj.field]: sortObj.dir };

  const query = buildQueryFromReq(req);
  const [total, items] = await Promise.all([
    repo.count(query),
    repo.find(query, {
      sort,
      skip: (page - 1) * limit,
      limit,
      populate: ["category", "subCategory", "brand", "materials"],
    }),
  ]);

  return {
    items: serializeList(items),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getProduct = async (id) => {
  const item = await repo.findById(id, [
    "category",
    "subCategory",
    "brand",
    "materials",
  ]);
  if (!item) return null;
  const enquiries = await repo.findEnquiriesByProductName(item.name, 5);
  return { item: serializeProduct(item), enquiries };
};

export const createProduct = async (payload, file) => {
  if (file) payload.image = `/uploads/products/${file.filename}`;
  if (payload.slug) {
    const exists = await repo.findOne({ slug: payload.slug });
    if (exists) throw { status: 400, message: "Duplicate slug" };
  }
  const created = await repo.create(payload);
  const doc = await repo.findById(created._id, [
    "category",
    "subCategory",
    "brand",
    "materials",
  ]);
  return serializeProduct(doc);
};

export const updateProduct = async (id, payload, file) => {
  if (file) payload.image = `/uploads/products/${file.filename}`;
  if (payload.slug) {
    const existing = await repo.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (existing) throw { status: 400, message: "Duplicate slug" };
  }
  const updated = await repo.updateById(id, payload);
  if (!updated) throw { status: 404, message: "Product not found" };
  const doc = await repo.findById(id, [
    "category",
    "subCategory",
    "brand",
    "materials",
  ]);
  return serializeProduct(doc);
};

export const deleteProduct = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Product not found" };
  return removed;
};

export const bulkDelete = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw { status: 400, message: "ids[] required" };
  return repo.deleteMany(ids);
};

export const bulkStatusUpdate = async (ids, isVisible) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw { status: 400, message: "ids[] required" };
  if (typeof isVisible !== "boolean")
    throw { status: 400, message: "isVisible boolean required" };
  return repo.updateMany(ids, { isVisible });
};

export default {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDelete,
  bulkStatusUpdate,
};
