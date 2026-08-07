import SubCategory from "../../../models/SubCategory.js";

export const count = (query) => SubCategory.countDocuments(query);
export const find = (query, { sort = {}, skip = 0, limit = 50 } = {}) =>
  SubCategory.find(query).sort(sort).skip(skip).limit(limit).populate("category", "name").lean();
export const findById = (id) => SubCategory.findById(id).lean();
export const findOne = (query) => SubCategory.findOne(query).lean();
export const create = (payload) => SubCategory.create(payload);
export const updateById = (id, payload, opts = { new: true }) => SubCategory.findByIdAndUpdate(id, payload, opts).lean();
export const deleteById = (id) => SubCategory.findByIdAndDelete(id).lean();
export const deleteMany = (ids) => SubCategory.deleteMany({ _id: { $in: ids } });

export default { count, find, findById, findOne, create, updateById, deleteById, deleteMany };