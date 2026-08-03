import mongoose from "mongoose";

const otpSessionSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    verified: {
      type: Boolean,
      required: true,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    sessionId: {
      type: String,
      default: undefined,
      trim: true,
    },

    sessionExpiresAt: {
      type: Date,
      default: null,
    },

    lastVerificationIp: {
      type: String,
      default: "",
      trim: true,
    },

    lastVerificationUserAgent: {
      type: String,
      default: "",
      trim: true,
    },

    cleanupAt: {
      type: Date,
      required: true,
    },

    resendCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    resendWindowStartedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

otpSessionSchema.index({ cleanupAt: 1 }, { expireAfterSeconds: 0 });
otpSessionSchema.index({ leadId: 1, verified: 1, expiresAt: 1 });
otpSessionSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

export default mongoose.model("OtpSession", otpSessionSchema);
