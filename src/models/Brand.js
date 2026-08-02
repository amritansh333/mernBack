import mongoose from "mongoose";
import {
  DEFAULT_PRODUCT_EXPERIENCE,
  PRODUCT_EXPERIENCE_VALUES,
} from "../constants/productExperiences.js";

const brandSchema = new mongoose.Schema(
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

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
    ],

    image: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 99,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

brandSchema.index({
  experience: 1,
  subCategory: 1,
  order: 1,
});
brandSchema.index({ subCategory: 1, order: 1, name: 1 });

export default mongoose.model("Brand", brandSchema);
