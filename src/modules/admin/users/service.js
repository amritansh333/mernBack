import User from "./User.js";
import bcrypt from "bcryptjs";

export const listUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}) => {
  const skip = Math.max(0, page - 1) * limit;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (status && status !== "all") filter.status = status;

  const [rows, total] = await Promise.all([
    User.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  // strip sensitive fields
  const safeRows = rows.map((r) => ({
    id: r._id,
    name: r.name,
    email: r.email,
    role: r.role,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    lastLoginAt: r.meta?.lastLoginAt || null,
  }));

  return {
    rows: safeRows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getUser = async (id) => {
  const r = await User.findById(id).lean();
  if (!r) return null;
  return {
    id: r._id,
    name: r.name,
    email: r.email,
    role: r.role,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    lastLoginAt: r.meta?.lastLoginAt || null,
  };
};

export const createUser = async (data) => {
  const payload = { ...data };
  if (payload.password) {
    const salt = bcrypt.genSaltSync(10);
    payload.passwordHash = bcrypt.hashSync(payload.password, salt);
    delete payload.password;
  }
  const u = new User(payload);
  const saved = await u.save();
  const r = saved.toObject();
  return {
    id: r._id,
    name: r.name,
    email: r.email,
    role: r.role,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    lastLoginAt: r.meta?.lastLoginAt || null,
  };
};

export const updateUser = async (id, data) => {
  const payload = { ...data };
  if (payload.password) {
    const salt = bcrypt.genSaltSync(10);
    payload.passwordHash = bcrypt.hashSync(payload.password, salt);
    delete payload.password;
  }
  const updated = await User.findByIdAndUpdate(id, payload, { new: true }).lean();
  if (!updated) return null;
  return {
    id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    status: updated.status,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    lastLoginAt: updated.meta?.lastLoginAt || null,
  };
};

export const deleteUser = async (id) => User.findByIdAndDelete(id);

export const bulkDeleteUsers = async (ids) => {
  const res = await User.deleteMany({ _id: { $in: ids } });
  return res.deletedCount;
};

export const countUsers = () => User.countDocuments({});

export const latestUsers = (limit = 6) =>
  User.find({}).sort({ createdAt: -1 }).limit(limit).lean().then((rows) =>
    rows.map((r) => ({ id: r._id, name: r.name, email: r.email, role: r.role, createdAt: r.createdAt })),
  );

export default {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  bulkDeleteUsers,
  countUsers,
  latestUsers,
};
