import Category from "../../../models/Category.js";

export const count = (query) => Category.countDocuments(query);
export const find = (query, { sort = {}, skip = 0, limit = 50 } = {}) =>
  Category.find(query).sort(sort).skip(skip).limit(limit).lean();
export const findById = (id) => Category.findById(id).lean();
export const findOne = (query) => Category.findOne(query).lean();
export const create = (payload) => Category.create(payload);
export const updateById = (id, payload, opts = { new: true }) =>
  Category.findByIdAndUpdate(id, payload, opts).lean();
export const deleteById = (id) => Category.findByIdAndDelete(id).lean();
export const deleteMany = (ids) => Category.deleteMany({ _id: { $in: ids } });

export default {
  count,
  find,
  findById,
  findOne,
  create,
  updateById,
  deleteById,
  deleteMany,
};
