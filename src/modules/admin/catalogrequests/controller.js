import * as service from "./service.js";

export const listCatalogRequests = async (req, res) => {
  const page = parseInt(req.query.page || "1", 10) || 1;
  const limit = parseInt(req.query.limit || "10", 10) || 10;
  const search = req.query.search || req.query.q || "";
  const sortBy = req.query.sortBy || "created_at";
  const sortOrder = req.query.sortOrder || "desc";

  const result = await service.listCatalogRequests({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  return res.apiSuccess(result.rows, undefined, result.pagination);
};

export const getCatalogRequest = async (req, res) => {
  const id = req.params.id;
  const item = await service.getCatalogRequest(id);

  if (!item) {
    return res.apiError(404, "Catalog request not found");
  }

  return res.apiSuccess(item);
};

export default {
  listCatalogRequests,
  getCatalogRequest,
};
