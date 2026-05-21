import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: String,
    order: {
      type: Number,
      default: 99, // Default order if not specified
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);