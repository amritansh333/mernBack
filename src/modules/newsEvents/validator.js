export const validateSlugParam = (slug) => {
  if (!slug || typeof slug !== "string") {
    const error = new Error("Slug is required.");
    error.statusCode = 400;
    throw error;
  }

  const normalized = slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    const error = new Error("Invalid slug.");
    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

export const validateListQuery = (query = {}) => {
  const type = typeof query.type === "string" ? query.type.trim() : undefined;

  const pageValue = Number(query.page);
  const page = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

  const limitValue = Number(query.limit);
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.min(Math.floor(limitValue), 100) : 12;

  const sort = typeof query.sort === "string" ? query.sort.trim() : "newest";

  const tag = typeof query.tag === "string" ? query.tag.trim() : undefined;
  const search = typeof query.search === "string" ? query.search.trim() : undefined;
  const featured = query.featured === "true" || query.featured === true;

  return { type, page, limit, sort, tag, search, featured };
};
