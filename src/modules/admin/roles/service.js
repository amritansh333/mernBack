import * as repo from "./repository.js";
import { serializeRole, serializeList } from "./serializer.js";
import { validatePagination } from "./validator.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const listRoles = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || "name:asc";
  const [sortField, sortDir] = sortParam.split(":");
  const sort = { [sortField || "name"]: sortDir === "desc" ? -1 : 1 };

  const q = {};
  if (req.query.search)
    q.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { slug: { $regex: req.query.search, $options: "i" } },
    ];

  // optional filters (e.g., permission)
  if (req.query.permission) q.permissions = req.query.permission;

  const [total, items] = await Promise.all([
    repo.count(q),
    repo.find(q, { sort, skip: (page - 1) * limit, limit }),
  ]);
  return {
    items: items.map(serializeRole),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getRole = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  return { item: serializeRole(item) };
};

export const createRole = async (payload) => {
  if (!payload.name || !payload.slug)
    throw { status: 400, message: "name and slug required" };
  const exists = await repo.findOne({
    $or: [{ slug: payload.slug }, { name: payload.name }],
  });
  if (exists) throw { status: 400, message: "Duplicate role name or slug" };
  const created = await repo.create(payload);
  return serializeRole(created.toObject ? created.toObject() : created);
};

export const updateRole = async (id, payload) => {
  if (payload.slug) {
    const existing = await repo.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (existing) throw { status: 400, message: "Duplicate slug" };
  }
  const updated = await repo.updateById(id, payload);
  if (!updated) throw { status: 404, message: "Role not found" };
  return serializeRole(updated);
};

export const deleteRole = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Role not found" };
  return removed;
};

export const bulkDelete = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw { status: 400, message: "ids[] required" };
  return repo.deleteMany(ids);
};

export const permissionMatrix = async () => {
  // Build a basic permission matrix by listing admin modules and creating CRUD perms
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const adminDir = path.resolve(__dirname, "..");
    const entries = fs.readdirSync(adminDir, { withFileTypes: true });
    const modules = entries
      .filter((d) => d.isDirectory() && !["common", "auth"].includes(d.name))
      .map((d) => d.name);
    const matrix = {};
    modules.forEach((m) => {
      matrix[m] = ["list", "get", "create", "update", "delete"].map(
        (a) => `${m}.${a}`,
      );
    });
    return matrix;
  } catch (err) {
    // fallback set
    return {
      users: [
        "users.list",
        "users.get",
        "users.create",
        "users.update",
        "users.delete",
      ],
    };
  }
};

export const assignPermissions = async (id, permissions = []) => {
  if (!Array.isArray(permissions) || permissions.length === 0)
    throw { status: 400, message: "permissions[] required" };
  const updated = await repo.addPermissions(id, permissions);
  if (!updated) throw { status: 404, message: "Role not found" };
  return serializeRole(updated);
};

export const removePermissions = async (id, permissions = []) => {
  if (!Array.isArray(permissions) || permissions.length === 0)
    throw { status: 400, message: "permissions[] required" };
  const updated = await repo.removePermissions(id, permissions);
  if (!updated) throw { status: 404, message: "Role not found" };
  return serializeRole(updated);
};

export default {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  bulkDelete,
  permissionMatrix,
  assignPermissions,
  removePermissions,
};
