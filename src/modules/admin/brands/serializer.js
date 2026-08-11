const toReference = (ref) => {
  if (!ref) return null;
  if (typeof ref === "string") return { id: ref, name: ref, slug: ref };
  const id = ref._id ?? ref.id;
  return {
    id: id ? String(id) : undefined,
    name: ref.name ?? undefined,
    slug: ref.slug ?? undefined,
  };
};

const toReferences = (refs) =>
  Array.isArray(refs)
    ? refs
        .map(toReference)
        .filter((item) => item && (item.name || item.slug || item.id))
    : [];

export const serializeBrand = (doc) => {
  if (!doc) return null;
  const { _id, name, slug, isVisible, createdAt, updatedAt } = doc;
  return { id: _id, name, slug, isVisible: !!isVisible, createdAt, updatedAt };
};

export const serializeBrandDetail = (doc) => {
  if (!doc) return null;
  const {
    _id,
    name,
    slug,
    subCategory,
    materials,
    description,
    image,
    order,
    experience,
    isVisible,
    createdAt,
    updatedAt,
  } = doc;

  const result = {
    id: _id,
    name,
    slug,
    subCategory: toReference(subCategory),
    materials: toReferences(materials),
    description,
    image,
    order,
    experience,
    createdAt,
    updatedAt,
  };

  if (isVisible !== undefined) {
    result.isVisible = !!isVisible;
  }

  return result;
};

export const serializeList = (docs) =>
  Array.isArray(docs) ? docs.map(serializeBrand) : [];

export default { serializeBrand, serializeList, serializeBrandDetail };
