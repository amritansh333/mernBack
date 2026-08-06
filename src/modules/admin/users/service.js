import User from './User.js';

export const listUsers = async ({ page = 1, limit = 10, search = '', status = '' }) => {
  const skip = Math.max(0, page - 1) * limit;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (status && status !== 'all') filter.status = status;

  const [rows, total] = await Promise.all([
    User.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return { rows, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } };
};

export const getUser = async (id) => User.findById(id).lean();

export const createUser = async (data) => {
  const u = new User(data);
  const saved = await u.save();
  return saved.toObject();
};

export const updateUser = async (id, data) => User.findByIdAndUpdate(id, data, { new: true }).lean();

export const deleteUser = async (id) => User.findByIdAndDelete(id);

export const bulkDeleteUsers = async (ids) => {
  const res = await User.deleteMany({ _id: { $in: ids } });
  return res.deletedCount;
};

export const countUsers = () => User.countDocuments({});

export const latestUsers = (limit = 6) => User.find({}).sort({ createdAt: -1 }).limit(limit).lean();

export default { listUsers, getUser, createUser, updateUser, deleteUser, bulkDeleteUsers, countUsers, latestUsers };