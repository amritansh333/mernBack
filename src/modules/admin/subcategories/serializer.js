export const serializeSubcategory = (doc) => {
  if (!doc) return null;
  const {
    _id,
    name,
    slug,
    category,
    experience,
    order,
    image,
    createdAt,
    updatedAt,
  } = doc;

  return {
    id: _id,
    name,
    slug,
    category: category && category.name ? category : category,
    categoryName: category && category.name ? category.name : undefined,
    experience,
    order,
    image,
    createdAt,
    updatedAt,
  };
};

export const serializeList = (docs) => (Array.isArray(docs) ? docs.map(serializeSubcategory) : []);

export default { serializeSubcategory, serializeList };
