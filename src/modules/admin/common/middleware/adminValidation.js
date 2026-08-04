import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const requireBodyKeys = (keys = []) => (req, res, next) => {
  const missing = keys.filter((k) => req.body[k] === undefined);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
  }
  return next();
};

export const validateObjectIdParam = (paramName, label = paramName) => (
  req,
  res,
  next,
) => {
  const val = req.params[paramName] || req.body[paramName] || req.query[paramName];
  if (!val) return next();
  if (!isValidObjectId(val)) {
    return res.status(400).json({ message: `Invalid ${label}` });
  }
  return next();
};

export default { requireBodyKeys, validateObjectIdParam };
