export const serializeSetting = (doc) => {
  if (!doc) return null;
  const { _id, key, name, value, description, group, type, isVisible, order, createdAt, updatedAt } = doc;
  return { id: _id, key, name, value, description, group, type, isVisible: !!isVisible, order, createdAt, updatedAt };
};

export const serializeList = (docs) => (Array.isArray(docs) ? docs.map(serializeSetting) : []);

export default { serializeSetting, serializeList };
