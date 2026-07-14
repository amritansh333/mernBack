import mongoose from "mongoose";
import {
  DEFAULT_PRODUCT_EXPERIENCE,
  PRODUCT_EXPERIENCE_VALUES,
} from "../constants/productExperiences.js";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    experience: {
      type: String,
      enum: PRODUCT_EXPERIENCE_VALUES,
      default: DEFAULT_PRODUCT_EXPERIENCE,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    order: {
      type: Number,
      default: 99,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.index({
  experience: 1,
  category: 1,
  order: 1,
});
subCategorySchema.index({ category: 1, order: 1, name: 1 });

export default mongoose.model("SubCategory", subCategorySchema);
