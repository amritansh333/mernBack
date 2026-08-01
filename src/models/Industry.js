import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    seo: {
      metaTitle: {
        type: String,
        trim: true,
        default: "",
      },
      metaDescription: {
        type: String,
        trim: true,
        default: "",
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Industry", industrySchema);
