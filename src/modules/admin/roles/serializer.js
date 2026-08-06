export const serializeRole = (r = {}) => {
  if (!r) return null;
  return {
    id: r._id ? String(r._id) : r.id || null,
    name: r.name || "",
    slug: r.slug || "",
    description: r.description || "",
    permissions: Array.isArray(r.permissions) ? r.permissions : [],
    meta: r.meta || {},
    createdAt: r.createdAt || r.created_at || null,
    updatedAt: r.updatedAt || r.updated_at || null,
  };
};

export const serializeList = (items = []) => items.map(serializeRole);

export default { serializeRole, serializeList };