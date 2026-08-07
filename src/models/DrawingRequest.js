import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true, trim: true },
    storedName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    extension: { type: String, required: true, trim: true },
    size: { type: Number, required: true },
    relativePath: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const drawingRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    company: { type: String, required: true, trim: true, maxlength: 150 },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      validate: {
        validator: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email address",
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => /^\d{7,15}$/.test(value),
        message: "Phone number must contain 7 to 15 digits",
      },
    },
    notes: { type: String, trim: true, default: "" },
    status: {
      type: String,
      trim: true,
      enum: ["NEW", "UNDER_REVIEW", "QUOTED", "COMPLETED", "REJECTED"],
      default: "NEW",
    },
    files: { type: [fileSchema], required: true, default: [] },
  },
  { timestamps: true }
);

drawingRequestSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("DrawingRequest", drawingRequestSchema);
