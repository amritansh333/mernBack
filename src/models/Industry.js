import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    subtitle: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    intro: {
      type: String,
      trim: true,
      default: "",
    },

    capabilities: {
      type: [String],
      default: [],
    },

    standards: {
      type: [String],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
    },

    path: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    seo: {
      metaTitle: {
        type: String,
        trim: true,
        default: "",
      },

      metaDescription: {
        type: String,
        trim: true,
        default: "",
      },

      keywords: {
        type: [String],
        default: [],
      },

      canonicalPath: {
        type: String,
        trim: true,
        default: "",
      },

      ogTitle: {
        type: String,
        trim: true,
        default: "",
      },

      ogDescription: {
        type: String,
        trim: true,
        default: "",
      },

      ogImage: {
        type: String,
        trim: true,
        default: "",
      },

      ogType: {
        type: String,
        trim: true,
        default: "website",
      },

      twitterCard: {
        type: String,
        trim: true,
        default: "summary_large_image",
      },

      twitterTitle: {
        type: String,
        trim: true,
        default: "",
      },

      twitterDescription: {
        type: String,
        trim: true,
        default: "",
      },

      twitterImage: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  { timestamps: true },
);

industrySchema.pre("validate", function (next) {
  if (this.slug) {
    this.path = `/industries/${this.slug}`;
  }

  if (!this.title) {
    this.title = this.name;
  }

  next();
});

export default mongoose.model("Industry", industrySchema);
