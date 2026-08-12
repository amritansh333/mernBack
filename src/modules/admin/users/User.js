import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    role: { type: String, default: "viewer", trim: true },
    status: { type: String, default: "Active", trim: true },
    passwordHash: { type: String },
    meta: { type: Object, default: {} },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
