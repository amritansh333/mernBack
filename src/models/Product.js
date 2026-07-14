import mongoose from "mongoose";
import {
  DEFAULT_PRODUCT_EXPERIENCE,
  PRODUCT_EXPERIENCE_VALUES,
} from "../constants/productExperiences.js";

const objectId = mongoose.Schema.Types.ObjectId;
const mixed = mongoose.Schema.Types.Mixed;

const downloadSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
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
  { _id: false }
);

const productSchema = new mongoose.Schema(
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

    category: {
      type: objectId,
      ref: "Category",
      default: null,
    },

    subCategory: {
      type: objectId,
      ref: "SubCategory",
      default: null,
    },

    brand: {
      type: objectId,
      ref: "Brand",
      default: null,
    },

    path: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    order: {
      type: Number,
      default: 99,
      min: 0,
    },

    materials: [
      {
        type: objectId,
        ref: "Material",
      },
    ],

    industries: [
      {
        type: objectId,
        ref: "Industry",
      },
    ],

    description: {
      type: [String],
      default: [],
    },

    keyFeatures: {
      type: [String],
      default: [],
    },

    applications: {
      type: [String],
      default: [],
    },

    specifications: {
      type: Map,
      of: mixed,
      default: {},
    },

    downloads: {
      type: [downloadSchema],
      default: [],
    },

    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    isVisible: {
      type: Boolean,
      default: true,
    },

    pdfUrl: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    machineComponentData: {
      description: {
        type: [String],
        default: [],
      },

      applications: {
        type: [String],
        default: [],
      },

      specifications: {
        type: Map,
        of: mixed,
        default: {},
      },

      downloads: {
        type: [downloadSchema],
        default: [],
      },

      order: {
        type: Number,
        default: 99,
        min: 0,
      },

      isVisible: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

productSchema.index(
  { path: 1 },
  {
    unique: true,
    partialFilterExpression: { path: { $type: "string" } },
  }
);

productSchema.index({
  experience: 1,
  category: 1,
  subCategory: 1,
  brand: 1,
  order: 1,
});

productSchema.index({ category: 1, order: 1 });
productSchema.index({ subCategory: 1, order: 1 });
productSchema.index({ brand: 1, order: 1 });
productSchema.index({ materials: 1, order: 1 });
productSchema.index({ materials: 1, createdAt: -1 });
productSchema.index({ industries: 1, order: 1 });
productSchema.index({ industries: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);
