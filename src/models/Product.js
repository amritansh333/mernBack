import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
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

    // 🔹 CATEGORY (single)
    category: {
      type: String, // category slug
      required: true,
      index: true
    },

    // 🔹 MATERIALS (multiple)
    materials: [
      {
        type: String, // material slug
        index: true
      }
    ],

    // 🔹 INDUSTRIES (multiple)
    industries: [
      {
        type: String, // industry slug
        index: true
      }
    ],

    image: {
        type: String,
        default: "",
    },


    description: [String],

    keyFeatures: [String],

    applications: [String],

    specifications: Object,

    pdfUrl: String,

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
