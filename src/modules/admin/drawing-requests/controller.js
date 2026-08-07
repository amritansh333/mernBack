import * as service from "./service.js";

export const listDrawingRequests = async (req, res) => {
  const page = parseInt(req.query.page || "1", 10) || 1;
  const limit = parseInt(req.query.limit || "10", 10) || 10;
  const search = req.query.search || req.query.q || "";
  const status = typeof req.query.status === "string" ? req.query.status.trim().toUpperCase() : "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder || "desc";

  const result = await service.listDrawingRequests({ page, limit, search, status, sortBy, sortOrder });
  return res.apiSuccess(result.rows, undefined, result.pagination);
};

export const getDrawingRequest = async (req, res) => {
  const id = req.params.id;
  const item = await service.getDrawingRequest(id);

  if (!item) {
    return res.apiError(404, "Drawing request not found");
  }

  return res.apiSuccess(item);
};

export const updateDrawingRequestStatus = async (req, res) => {
  const id = req.params.id;
  const status = typeof req.body.status === "string" ? req.body.status.trim() : "";

  try {
    const item = await service.updateDrawingRequestStatus(id, status);

    if (!item) {
      return res.apiError(404, "Drawing request not found");
    }

    return res.apiSuccess(item, "Status updated successfully");
  } catch (error) {
    return res.apiError(error.statusCode || 500, error.message || "Unable to update status");
  }
};

export const deleteDrawingRequest = async (req, res) => {
  const id = req.params.id;
  const item = await service.deleteDrawingRequest(id);

  if (!item) {
    return res.apiError(404, "Drawing request not found");
  }

  return res.apiSuccess(true, "Drawing request deleted successfully");
};

export default { listDrawingRequests, getDrawingRequest, updateDrawingRequestStatus, deleteDrawingRequest };