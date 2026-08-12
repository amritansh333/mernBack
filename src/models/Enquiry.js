import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    product: {
      type: String,
      trim: true,
      default: "",
    },

    requirement: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Resolved", "Closed"],
      default: "New",
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Enquiry", enquirySchema);
