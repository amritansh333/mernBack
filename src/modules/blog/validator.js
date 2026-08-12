export const validateSlugParam = (slug) => {
  if (!slug || typeof slug !== "string") {
    const error = new Error("Blog slug is required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedSlug = slug.trim().toLowerCase();

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
    const error = new Error("Invalid blog slug.");
    error.statusCode = 400;
    throw error;
  }

  return normalizedSlug;
};

export const validateListQuery = (query = {}) => {
  const allowedTypes = new Set(["Blog", "Gallery"]);

  const type = typeof query.type === "string" ? query.type.trim() : undefined;

  if (type && !allowedTypes.has(type)) {
    const error = new Error("Invalid blog type. Use Blog or Gallery.");

    error.statusCode = 400;

    throw error;
  }

  const limitValue = Number(query.limit);

  const limit =
    Number.isFinite(limitValue) && limitValue > 0
      ? Math.min(Math.floor(limitValue), 100)
      : 50;

  return {
    type,
    category:
      typeof query.category === "string" ? query.category.trim() : undefined,

    tag: typeof query.tag === "string" ? query.tag.trim() : undefined,

    limit,
  };
};
