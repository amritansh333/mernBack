import SystemLog from './SystemLog.js';

export const count = (query = {}) => SystemLog.countDocuments(query);

export const find = (query = {}, opts = {}) => {
  const { sort = { timestamp: -1 }, skip = 0, limit = 10 } = opts;
  return SystemLog.find(query).sort(sort).skip(skip).limit(limit).lean();
};

export const findById = (id) => SystemLog.findById(id).lean();

export const create = (payload) => new SystemLog(payload).save();

export const deleteById = (id) => SystemLog.findByIdAndDelete(id);

export const deleteMany = (ids) => SystemLog.deleteMany({ _id: { $in: ids } });

export default { count, find, findById, create, deleteById, deleteMany };