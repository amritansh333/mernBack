export const PRODUCT_EXPERIENCES = Object.freeze({
  SEMI_FINISHED: "semi_finished",
  MACHINE_COMPONENTS: "machine_components",
});

export const DEFAULT_PRODUCT_EXPERIENCE = PRODUCT_EXPERIENCES.SEMI_FINISHED;

export const PRODUCT_EXPERIENCE_VALUES = Object.freeze(
  Object.values(PRODUCT_EXPERIENCES),
);

export const isSupportedProductExperience = (experience) =>
  PRODUCT_EXPERIENCE_VALUES.includes(experience);
