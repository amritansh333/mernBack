import mongoose from "mongoose";
import {
  DEFAULT_PRODUCT_EXPERIENCE,
  PRODUCT_EXPERIENCE_VALUES,
} from "../constants/productExperiences.js";

const categorySchema = new mongoose.Schema(
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

    experience: {
      type: String,
      enum: PRODUCT_EXPERIENCE_VALUES,
      default: DEFAULT_PRODUCT_EXPERIENCE,
      required: true,
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 99,
      min: 0,
    },

    subCategories: [
      {
        name: {
          type: String,
          trim: true,
        },
        slug: {
          type: String,
          trim: true,
          lowercase: true,
        },
      },
    ],
  },
  { timestamps: true }
);

categorySchema.index({ experience: 1, order: 1 });

export default mongoose.model("Category", categorySchema);
