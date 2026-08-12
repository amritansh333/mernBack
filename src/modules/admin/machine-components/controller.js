import * as service from "./service.js";

export const listMachineComponents = async (req, res) => {
  const { items, meta } = await service.listMachineComponents(req);
  return res.apiSuccess(items, "Machine components fetched", meta);
};

export const getMachineComponent = async (req, res) => {
  const data = await service.getMachineComponent(req.params.id);
  if (!data || !data.item)
    return res.apiError(404, "Machine component not found");
  return res.apiSuccess(data.item, "Machine component fetched");
};

export const createMachineComponent = async (req, res) => {
  const created = await service.createMachineComponent(
    req.body || {},
    req.file,
  );
  return res.apiSuccess(created, "Machine component created");
};

export const updateMachineComponent = async (req, res) => {
  const updated = await service.updateMachineComponent(
    req.params.id,
    req.body || {},
    req.file,
  );
  return res.apiSuccess(updated, "Machine component updated");
};

export const deleteMachineComponent = async (req, res) => {
  const removed = await service.deleteMachineComponent(req.params.id);
  return res.apiSuccess(removed, "Machine component deleted");
};

export default {
  listMachineComponents,
  getMachineComponent,
  createMachineComponent,
  updateMachineComponent,
  deleteMachineComponent,
};
