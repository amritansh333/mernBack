import mongoose from "mongoose";

const quoteItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: false, trim: true },
    productName: { type: String, required: false, trim: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: "pcs" },
  },
  { _id: false }
);

const quoteRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    items: { type: [quoteItemSchema], default: [] },
    message: { type: String, default: "", trim: true },
    status: { type: String, trim: true, default: "Pending" },
  },
  { timestamps: true }
);

quoteRequestSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("QuoteRequest", quoteRequestSchema);
