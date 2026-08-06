import Role from "./Role.js";


export const count = (query) => Role.countDocuments(query);
export const find = (query, { sort = {}, skip = 0, limit = 50 } = {}) =>
  Role.find(query).sort(sort).skip(skip).limit(limit).lean();
export const findById = (id) => Role.findById(id).lean();
export const findOne = (query) => Role.findOne(query).lean();
export const create = (payload) => Role.create(payload);
export const updateById = (id, payload, opts = { new: true }) =>
  Role.findByIdAndUpdate(id, payload, opts).lean();
export const deleteById = (id) => Role.findByIdAndDelete(id).lean();
export const deleteMany = (ids) => Role.deleteMany({ _id: { $in: ids } });

export const addPermissions = (id, permissions = []) =>
  Role.findByIdAndUpdate(
    id,
    { $addToSet: { permissions: { $each: permissions } } },
    { new: true },
  ).lean();

export const removePermissions = (id, permissions = []) =>
  Role.findByIdAndUpdate(
    id,
    { $pull: { permissions: { $in: permissions } } },
    { new: true },
  ).lean();

export default { count, find, findById, findOne, create, updateById, deleteById, deleteMany, addPermissions, removePermissions };