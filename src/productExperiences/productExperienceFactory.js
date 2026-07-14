import {
  getEnabledProductExperiencesByPriority,
  getProductExperienceByCategorySlug,
  getProductExperienceById,
} from "./productExperienceRegistry.js";

const normalizeSlug = (slug) =>
  typeof slug === "string" ? slug.trim().toLowerCase() : null;

const getImplementation = (entry) => entry?.implementation || null;

/**
 * Returns a registered product experience implementation by registry id.
 */
export const getProductExperienceImplementation = (id) =>
  getImplementation(getProductExperienceById(id));

/**
 * Resolves the product experience implementation for a category document.
 */
export const resolveProductExperienceImplementation = (category) => {
  if (!category) {
    return null;
  }

  const categorySlug = normalizeSlug(category.slug);
  const slugMatch = categorySlug
    ? getProductExperienceByCategorySlug(categorySlug)
    : null;

  const experienceMatch =
    slugMatch ||
    getEnabledProductExperiencesByPriority().find(
      (entry) =>
        entry.categorySlug === null && entry.experience === category.experience
    );

  return getImplementation(experienceMatch);
};

export default {
  getProductExperienceImplementation,
  resolveProductExperienceImplementation,
};
