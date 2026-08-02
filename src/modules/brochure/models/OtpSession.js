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

    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

otpSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSessionSchema.index({ leadId: 1, verified: 1, expiresAt: 1 });

export default mongoose.model("OtpSession", otpSessionSchema);
