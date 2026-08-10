import * as repo from "./repository.js";
import { validatePagination } from "../categories/validator.js";

export const listMachineComponents = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const sortParam = req.query.sort || "order:asc";
  const [sortField, sortDir] = sortParam.split(":");
  const sort = { [sortField || "order"]: sortDir === "desc" ? -1 : 1 };

  const q = {};
  if (req.query.search) {
    q.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { slug: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const total = await repo.count(q);
  const items = await repo.find(q, { sort, skip: (page - 1) * limit, limit });
  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getMachineComponent = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  return { item };
};

export const createMachineComponent = async (payload, file) => {
  if (file) payload.image = `/uploads/products/${file.filename}`;
  const created = await repo.create(payload);
  return created;
};

export const updateMachineComponent = async (id, payload, file) => {
  if (file) payload.image = `/uploads/products/${file.filename}`;
  const updated = await repo.updateById(id, payload);
  if (!updated) throw { status: 404, message: "Machine component not found" };
  return updated;
};

export const deleteMachineComponent = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Machine component not found" };
  return removed;
};

export default {
  listMachineComponents,
  getMachineComponent,
  createMachineComponent,
  updateMachineComponent,
  deleteMachineComponent,
};
