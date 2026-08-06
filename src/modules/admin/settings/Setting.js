import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    type: {
      type: String,
      enum: ["string", "number", "boolean", "json", "object", "array"],
      default: "string",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    group: {
      type: String,
      trim: true,
      default: "",
    },

    isVisible: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 99,
      min: 0,
    },
  },
  { timestamps: true },
);

settingSchema.index({ group: 1, order: 1 });

export default mongoose.model("Setting", settingSchema);
