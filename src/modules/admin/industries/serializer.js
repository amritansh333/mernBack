export const serializeIndustry = (doc) => {
  if (!doc) return null;

  const seo = doc.seo || {};
  return {
    id: doc._id,
    name: doc.name || "",
    slug: doc.slug || "",
    description: doc.description || "",
    seo: {
      metaTitle: seo.metaTitle || "",
      metaDescription: seo.metaDescription || "",
      keywords: Array.isArray(seo.keywords) ? seo.keywords : [],
    },
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export const serializeList = (docs) =>
  Array.isArray(docs) ? docs.map(serializeIndustry) : [];

export default { serializeIndustry, serializeList };
