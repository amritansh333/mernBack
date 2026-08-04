export const serializeCategory = (doc) => {
  if (!doc) return null;
  const { _id, name, slug, order, parent, isVisible, createdAt, updatedAt } = doc;
  return { id: _id, name, slug, order, parent, isVisible: !!isVisible, createdAt, updatedAt };
};

export const serializeList = (docs) => (Array.isArray(docs) ? docs.map(serializeCategory) : []);

export default { serializeCategory, serializeList };
