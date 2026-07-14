import mongoose from "mongoose";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const validateQueryObjectId =
  (paramName, label = paramName) =>
  (req, res, next) => {
    const value = req.query[paramName];

    if (!value) {
      return next();
    }

    if (!isValidObjectId(value)) {
      return res.status(400).json({ message: `Invalid ${label}` });
    }

    return next();
  };

export const validateParamObjectId =
  (paramName, label = paramName) =>
  (req, res, next) => {
    const value = req.params[paramName];

    if (!isValidObjectId(value)) {
      return res.status(400).json({ message: `Invalid ${label}` });
    }

    return next();
  };
