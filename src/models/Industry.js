import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },

    description: {
      type: String
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Industry", industrySchema);
