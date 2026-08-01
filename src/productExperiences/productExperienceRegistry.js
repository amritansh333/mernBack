import { PRODUCT_EXPERIENCES } from "../constants/productExperiences.js";
import {
  buildCategoryPath,
  buildPath,
  buildProductPath,
  PRODUCT_BASE_PATH,
} from "../services/PathBuilderService.js";
import { createMachineComponentExperience } from "../modules/machineComponents/experience/machineComponentExperience.js";

export const PRODUCT_EXPERIENCE_IDS = Object.freeze({
  SEMI_FINISHED: "semi-finished",
  MACHINE_COMPONENTS: "machine-components",
});

const MACHINE_COMPONENTS_CATEGORY_SLUG = "thermoplastics-machine-components";
const MACHINE_COMPONENTS_ROOT_PATH = `${PRODUCT_BASE_PATH}/${MACHINE_COMPONENTS_CATEGORY_SLUG}`;
const REQUIRED_IMPLEMENTATION_METHODS = Object.freeze([
  "resolveCategory",
  "generateCategoryPath",
  "generateProductPath",
  "generateSidebar",
  "normalizeProduct",
  "generateCanonicalUrl",
]);

const semiFinishedRoutingStrategy = Object.freeze({
  type: "semi_finished",
  rootPath: PRODUCT_BASE_PATH,
  buildCategoryPath: (context) =>
    buildCategoryPath(context?.category || context),
  buildProductPath,
  generateCanonicalUrl: buildProductPath,
});

const machineComponentRoutingStrategy = createMachineComponentExperience({
  rootPath: MACHINE_COMPONENTS_ROOT_PATH,
});

const createProductExperienceImplementation = ({
  id,
  experience,
  rootPath,
  categorySlug,
  priority,
  routingStrategy,
}) => {
  const implementation = Object.freeze({
    id,
    experience,
    rootPath,
    categorySlug,
    priority,
    routingStrategy,
    resolveCategory:
      routingStrategy.resolveCategory ||
      (({ category = null } = {}) => category),
    generateCategoryPath:
      routingStrategy.buildCategoryPath ||
      (({ category }) => buildPath(rootPath, category.slug)),
    generateProductPath: routingStrategy.buildProductPath,
    generateSidebar: routingStrategy.generateSidebar || (() => []),
    normalizeProduct:
      routingStrategy.normalizeProduct ||
      (({ product = null } = {}) => product),
    generateCanonicalUrl:
      routingStrategy.generateCanonicalUrl || routingStrategy.buildProductPath,
    buildCatalogResponse: routingStrategy.buildCatalogResponse || null,
    buildSubcategoryResponse: routingStrategy.buildSubcategoryResponse || null,
  });

  for (const methodName of REQUIRED_IMPLEMENTATION_METHODS) {
    if (typeof implementation[methodName] !== "function") {
      throw new Error(`Product experience ${id} is missing ${methodName}`);
    }
  }

  return implementation;
};

const createRegistryEntry = (config) => {
  const implementation = createProductExperienceImplementation(config);

  return Object.freeze({
    ...config,
    implementation,
  });
};

export const PRODUCT_EXPERIENCE_REGISTRY = Object.freeze([
  createRegistryEntry({
    id: PRODUCT_EXPERIENCE_IDS.SEMI_FINISHED,
    experience: PRODUCT_EXPERIENCES.SEMI_FINISHED,
    rootPath: PRODUCT_BASE_PATH,
    categorySlug: null,
    priority: 10,
    enabled: true,
    routingStrategy: semiFinishedRoutingStrategy,
  }),
  createRegistryEntry({
    id: PRODUCT_EXPERIENCE_IDS.MACHINE_COMPONENTS,
    experience: PRODUCT_EXPERIENCES.MACHINE_COMPONENTS,
    rootPath: MACHINE_COMPONENTS_ROOT_PATH,
    categorySlug: MACHINE_COMPONENTS_CATEGORY_SLUG,
    priority: 20,
    enabled: true,
    routingStrategy: machineComponentRoutingStrategy,
  }),
]);

const ENABLED_PRODUCT_EXPERIENCES = Object.freeze(
  PRODUCT_EXPERIENCE_REGISTRY.filter((entry) => entry.enabled),
);
const ENABLED_PRODUCT_EXPERIENCES_BY_PRIORITY = Object.freeze(
  [...ENABLED_PRODUCT_EXPERIENCES].sort((a, b) => a.priority - b.priority),
);
const PRODUCT_EXPERIENCE_BY_ID = new Map(
  ENABLED_PRODUCT_EXPERIENCES.map((entry) => [entry.id, entry]),
);
const PRODUCT_EXPERIENCE_BY_EXPERIENCE = new Map(
  ENABLED_PRODUCT_EXPERIENCES.map((entry) => [entry.experience, entry]),
);
const PRODUCT_EXPERIENCE_BY_CATEGORY_SLUG = new Map(
  ENABLED_PRODUCT_EXPERIENCES.filter((entry) => entry.categorySlug).map(
    (entry) => [entry.categorySlug, entry],
  ),
);

export const getEnabledProductExperiences = () => ENABLED_PRODUCT_EXPERIENCES;

export const getEnabledProductExperiencesByPriority = () =>
  ENABLED_PRODUCT_EXPERIENCES_BY_PRIORITY;

export const getProductExperienceById = (id) =>
  PRODUCT_EXPERIENCE_BY_ID.get(id) || null;

export const getProductExperienceByExperience = (experience) =>
  PRODUCT_EXPERIENCE_BY_EXPERIENCE.get(experience) || null;

export const getProductExperienceByCategorySlug = (categorySlug) =>
  PRODUCT_EXPERIENCE_BY_CATEGORY_SLUG.get(categorySlug) || null;

export default {
  PRODUCT_EXPERIENCE_IDS,
  PRODUCT_EXPERIENCE_REGISTRY,
  getEnabledProductExperiences,
  getEnabledProductExperiencesByPriority,
  getProductExperienceByCategorySlug,
  getProductExperienceByExperience,
  getProductExperienceById,
};
