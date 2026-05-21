import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: {
      type: Number,
      default: 99, // Default order if not specified
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
    ],

    industries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
      },
    ],

    description: [String],
    keyFeatures: [String],
    applications: [String],

    specifications: {
      model: String,
      materialType: String,
      molecularWeight: String,
      form: String,
      thicknessRange: String,
      packagingType: String,
      colourOptions: [String],
      applicationAreas: [String],
      primaryUse: String,
      industrySuitability: String,
      keyProperties: [String],
      machinability: String,
    },

    pdfUrl: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);