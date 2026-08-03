import mongoose from "mongoose";

const downloadHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },

    productSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    downloadedAt: {
      type: Date,
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
      trim: true,
    },

    ip: {
      type: String,
      default: "",
      trim: true,
    },

    userAgent: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    productId: {
      type: String,
      required: true,
      trim: true,
    },

    productSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    currentRoute: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      trim: true,
      default: "otp_requested",
    },

    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    lastDownloadedAt: {
      type: Date,
      default: null,
    },

    downloadHistory: {
      type: [downloadHistorySchema],
      default: [],
    },
  },
  { timestamps: true },
);

leadSchema.index({ email: 1, mobileNumber: 1, productId: 1 });
leadSchema.index({ productSlug: 1, createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
