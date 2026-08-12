export const serializeSubcategory = (doc) => {
  if (!doc) return null;
  const { _id, category, ...rest } = doc;
  const serialized = {
    ...rest,
    id: _id,
    category: category && category.name ? category : category,
  };

  if (category && typeof category === 'object' && category.name) {
    serialized.categoryName = category.name;
  }

  return serialized;
};

export const serializeList = (docs) =>
  Array.isArray(docs) ? docs.map(serializeSubcategory) : [];

export default { serializeSubcategory, serializeList };
