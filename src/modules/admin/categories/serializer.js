const toSubCategoryReference = (subCategory) => {
  if (!subCategory) return null;
  if (typeof subCategory === "string")
    return { id: subCategory, name: subCategory, slug: subCategory };
  const id = subCategory._id ?? subCategory.id;
  return {
    id: id ? String(id) : undefined,
    name: subCategory.name ?? undefined,
    slug: subCategory.slug ?? undefined,
  };
};

export const serializeCategory = (doc) => {
  if (!doc) return null;
  const { _id, name, slug, order, parent, isVisible, createdAt, updatedAt } =
    doc;
  return {
    id: _id,
    name,
    slug,
    order,
    parent,
    isVisible: !!isVisible,
    createdAt,
    updatedAt,
  };
};

export const serializeCategoryDetail = (doc) => {
  if (!doc) return null;
  const {
    _id,
    name,
    slug,
    description,
    experience,
    image,
    order,
    subCategories,
    isVisible,
    createdAt,
    updatedAt,
  } = doc;

  const processedSubCategories = Array.isArray(subCategories)
    ? subCategories
        .map((sc) => toSubCategoryReference(sc))
        .filter((item) => item && (item.name || item.slug || item.id))
    : [];

  const result = {
    id: _id,
    name,
    slug,
    description,
    experience,
    image,
    order,
    subCategories: processedSubCategories,
    createdAt,
    updatedAt,
  };

  if (isVisible !== undefined) {
    result.isVisible = !!isVisible;
  }

  return result;
};

export const serializeList = (docs) =>
  Array.isArray(docs) ? docs.map(serializeCategory) : [];

export default { serializeCategory, serializeList, serializeCategoryDetail };
