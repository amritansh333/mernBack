export const serializeProduct = (doc) => {
  if (!doc) return null;
  const {
    _id,
    name,
    slug,
    description,
    sku,
    image,
    gallery,
    category,
    subCategory,
    brand,
    materials,
    isVisible,
    createdAt,
    updatedAt,
    seo,
  } = doc;

  return {
    id: _id,
    name,
    slug,
    description,
    sku,
    image,
    gallery,
    category,
    subCategory,
    brand,
    materials,
    isVisible: !!isVisible,
    seo: seo || {},
    createdAt,
    updatedAt,
  };
};

export const serializeList = (docs) => (Array.isArray(docs) ? docs.map(serializeProduct) : []);

export default { serializeProduct, serializeList };
