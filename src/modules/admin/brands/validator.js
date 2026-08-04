import mongoose from "mongoose";
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validatePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(200, Number(query.limit) || 50));
  return { page, limit };
};

export const validateId = (id) => !!id && isValidObjectId(id);

export default { validatePagination, validateId };