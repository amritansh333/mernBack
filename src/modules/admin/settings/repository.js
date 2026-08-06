import Setting from "./Setting.js";

export const count = (query) => Setting.countDocuments(query);
export const find = (query, { sort = {}, skip = 0, limit = 50 } = {}) =>
  Setting.find(query).sort(sort).skip(skip).limit(limit).lean();
export const findById = (id) => Setting.findById(id).lean();
export const findOne = (query) => Setting.findOne(query).lean();
export const create = (payload) => Setting.create(payload);
export const updateById = (id, payload, opts = { new: true }) =>
  Setting.findByIdAndUpdate(id, payload, opts).lean();
export const deleteById = (id) => Setting.findByIdAndDelete(id).lean();
export const deleteMany = (ids) => Setting.deleteMany({ _id: { $in: ids } });

export default { count, find, findById, findOne, create, updateById, deleteById, deleteMany };
