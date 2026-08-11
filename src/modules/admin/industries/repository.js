import Industry from "../../../models/Industry.js";

export const count = (query = {}) => Industry.countDocuments(query);

export const find = (
  query = {},
  { sort = { name: 1 }, skip = 0, limit = 50 } = {},
) => Industry.find(query).sort(sort).skip(skip).limit(limit).lean();

export const findById = (id) => Industry.findById(id).lean();
export const findOne = (query) => Industry.findOne(query).lean();
export const create = (payload) => Industry.create(payload);
export const updateById = (
  id,
  payload,
  opts = { new: true, runValidators: true },
) => Industry.findByIdAndUpdate(id, payload, opts).lean();
export const deleteById = (id) => Industry.findByIdAndDelete(id).lean();
export const deleteMany = (ids) => Industry.deleteMany({ _id: { $in: ids } });

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
