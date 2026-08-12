import CatalogRequest from "../../../models/CatalogRequest.js";

export const findById = (id) => CatalogRequest.findById(id).lean();

export const find = (
  filter = {},
  { sort = { created_at: -1 }, skip = 0, limit = 10 } = {}
) => CatalogRequest.find(filter).sort(sort).skip(skip).limit(limit).lean();

export const count = (filter = {}) => CatalogRequest.countDocuments(filter);

export default {
  findById,
  find,
  count,
};
