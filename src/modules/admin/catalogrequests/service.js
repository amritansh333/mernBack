import * as repository from "./repository.js";
import { serializeCatalogRequest, serializeCatalogRequestList } from "./serializer.js";

const ALLOWED_SORT_FIELDS = new Set([
  "created_at",
  "name",
  "email",
  "phone",
  "catalog_name",
]);

export const listCatalogRequests = async ({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "created_at",
  sortOrder = "desc",
}) => {
  const pageNumber = Number.isFinite(page) ? Math.max(1, page) : 1;
  const limitNumber = Number.isFinite(limit)
    ? Math.max(1, Math.min(limit, 100))
    : 10;

  const filter = {};
  const q = (search || "").trim();

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
      { message: { $regex: q, $options: "i" } },
      { catalog_name: { $regex: q, $options: "i" } },
    ];
  }

  const sortField = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "created_at";
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const skip = Math.max(0, pageNumber - 1) * limitNumber;

  const [rows, total] = await Promise.all([
    repository.find(filter, {
      sort: { [sortField]: sortDirection },
      skip,
      limit: limitNumber,
    }),
    repository.count(filter),
  ]);

  return {
    rows: rows.map(serializeCatalogRequestList),
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.max(1, Math.ceil(total / limitNumber)),
    },
  };
};

export const getCatalogRequest = async (id) => {
  const item = await repository.findById(id);
  return item ? serializeCatalogRequest(item) : null;
};

export default {
  listCatalogRequests,
  getCatalogRequest,
};
