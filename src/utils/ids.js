import mongoose from "mongoose";

export const toObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }

  return new mongoose.Types.ObjectId(value);
};

export const toIdString = (value) =>
  value?._id?.toString?.() || value?.toString?.() || null;
