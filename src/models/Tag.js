import mongoose from "mongoose";

const { Schema } = mongoose;

const tagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    description: { type: String, default: "", trim: true, maxlength: 500 },
    color: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export default mongoose.model("Tag", tagSchema);
