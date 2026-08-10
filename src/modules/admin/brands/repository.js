import Brand from "../../../models/Brand.js";

export const count = (query) => Brand.countDocuments(query);
export const find = (query, { sort = {}, skip = 0, limit = 50 } = {}) =>
  Brand.find(query).sort(sort).skip(skip).limit(limit).lean();
export const findById = (id) => Brand.findById(id).lean();
export const findOne = (query) => Brand.findOne(query).lean();
export const create = (payload) => Brand.create(payload);
export const updateById = (id, payload, opts = { new: true }) =>
  Brand.findByIdAndUpdate(id, payload, opts).lean();
export const deleteById = (id) => Brand.findByIdAndDelete(id).lean();
export const deleteMany = (ids) => Brand.deleteMany({ _id: { $in: ids } });

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
