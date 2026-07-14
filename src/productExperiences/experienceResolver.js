import { resolveProductExperienceImplementation } from "./productExperienceFactory.js";

export const resolveProductExperience = (category) => {
  return resolveProductExperienceImplementation(category);
};

export default {
  resolveProductExperience,
};
