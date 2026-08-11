export const serializeMaterial = (doc) => {
  if (!doc) return null;
  const { _id, name, slug, description, isVisible, createdAt, updatedAt } = doc;
  return {
    id: _id,
    name,
    slug,
    description: description ?? "",
    isVisible: !!isVisible,
    createdAt,
    updatedAt,
  };
};

export const serializeList = (docs) =>
  Array.isArray(docs) ? docs.map(serializeMaterial) : [];

export default { serializeMaterial, serializeList };
