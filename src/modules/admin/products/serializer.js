export const serializeProduct = (doc) => {
  if (!doc) return null;
  const {
    _id,
    name,
    slug,
    experience,
    category,
    subCategory,
    brand,
    path,
    order,
    materials,
    industries,
    description,
    keyFeatures,
    applications,
    specifications,
    downloads,
    seo,
    isVisible,
    pdfUrl,
    image,
    machineComponentData,
    createdAt,
    updatedAt,
  } = doc;

  return {
    id: _id,
    name,
    slug,
    experience,
    category,
    subCategory,
    brand,
    path,
    order,
    materials,
    industries,
    description,
    keyFeatures,
    applications,
    specifications,
    downloads,
    seo: seo || {},
    isVisible: isVisible !== undefined ? isVisible : true,
    pdfUrl,
    image,
    machineComponentData,
    createdAt,
    updatedAt,
  };
};

export const serializeList = (docs) =>
  Array.isArray(docs) ? docs.map(serializeProduct) : [];

export default { serializeProduct, serializeList };
