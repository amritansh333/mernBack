import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    summary: { type: String, default: "", trim: true },
    body: { type: String, default: "" },
    status: { type: String, default: "Draft", trim: true },
    author: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

contentSchema.index({ title: "text", summary: "text", body: "text" });

export default mongoose.model("ContentEntry", contentSchema);
