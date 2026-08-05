import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: false, trim: true },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: "" },
  },
  { _id: false }
);

const drawingRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    product: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    file: { type: fileSchema, default: null },
    status: { type: String, trim: true, default: "Pending" },
  },
  { timestamps: true }
);

drawingRequestSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("DrawingRequest", drawingRequestSchema);
