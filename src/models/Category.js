import mongoose from "mongoose";
import {
  DEFAULT_PRODUCT_EXPERIENCE,
  PRODUCT_EXPERIENCE_VALUES,
} from "../constants/productExperiences.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    experience: {
      type: String,
      enum: PRODUCT_EXPERIENCE_VALUES,
      default: DEFAULT_PRODUCT_EXPERIENCE,
      index: true
    },
    subCategories: [
      {
        name: String,
        slug: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
