import * as service from "./service.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

export const listRoles = [requirePermission('roles.read'), async (req, res) => {
  const { items, meta } = await service.listRoles(req);
  return res.apiSuccess(items, "Roles fetched", meta);
}];

export const getRole = [requirePermission('roles.read'), async (req, res) => {
  const data = await service.getRole(req.params.id);
  if (!data || !data.item) return res.apiError(404, "Role not found");
  return res.apiSuccess(data.item, "Role fetched");
}];

export const createRole = [requirePermission('roles.create'), async (req, res) => {
  const doc = await service.createRole(req.body || {});
  return res.apiSuccess(doc, "Role created");
}];

export const updateRole = [requirePermission('roles.update'), async (req, res) => {
  const doc = await service.updateRole(req.params.id, req.body || {});
  return res.apiSuccess(doc, "Role updated");
}];

export const deleteRole = [requirePermission('roles.delete'), async (req, res) => {
  const removed = await service.deleteRole(req.params.id);
  return res.apiSuccess(removed, "Role deleted");
}];

export const bulkDelete = [requirePermission('roles.delete'), async (req, res) => {
  const result = await service.bulkDelete(
    Array.isArray(req.body.ids) ? req.body.ids : [],
  );
  return res.apiSuccess(result, "Roles deleted");
}];

export const permissionMatrix = [requirePermission('roles.read'), async (req, res) => {
  const matrix = await service.permissionMatrix();
  return res.apiSuccess(matrix, "Permission matrix");
}];

export const assignPermissions = [requirePermission('roles.update'), async (req, res) => {
  const permissions = Array.isArray(req.body.permissions)
    ? req.body.permissions
    : [];
  const updated = await service.assignPermissions(req.params.id, permissions);
  return res.apiSuccess(updated, "Permissions assigned");
}];

export const removePermissions = [requirePermission('roles.update'), async (req, res) => {
  const permissions = Array.isArray(req.body.permissions)
    ? req.body.permissions
    : [];
  const updated = await service.removePermissions(req.params.id, permissions);
  return res.apiSuccess(updated, "Permissions removed");
}];

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
