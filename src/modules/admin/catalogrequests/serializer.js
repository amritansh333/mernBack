export const serializeCatalogRequest = (doc = {}) => {
  const payload = {
    _id: doc._id ?? doc.id ?? undefined,
    id: String(doc._id ?? doc.id ?? ""),
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    message: doc.message,
    catalog_name: doc.catalog_name,
    created_at: doc.created_at,
  };

  if (doc.__v !== undefined) payload.__v = doc.__v;

  return payload;
};

export const serializeCatalogRequestList = (doc = {}) => serializeCatalogRequest(doc);

export const serializeCatalogRequestDetail = (doc = {}) => serializeCatalogRequest(doc);
