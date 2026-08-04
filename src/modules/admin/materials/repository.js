import Material from "../../../models/Material.js";

export const count = (query) => Material.countDocuments(query);
export const find = (query, { sort = {}, skip = 0, limit = 50 } = {}) => Material.find(query).sort(sort).skip(skip).limit(limit).lean();
export const findById = (id) => Material.findById(id).lean();
export const findOne = (query) => Material.findOne(query).lean();
export const create = (payload) => Material.create(payload);
export const updateById = (id, payload, opts = { new: true }) => Material.findByIdAndUpdate(id, payload, opts).lean();
export const deleteById = (id) => Material.findByIdAndDelete(id).lean();
export const deleteMany = (ids) => Material.deleteMany({ _id: { $in: ids } });

export default { count, find, findById, findOne, create, updateById, deleteById, deleteMany };
