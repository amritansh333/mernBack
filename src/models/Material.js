import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },

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

    colour: {
      type: String,
      trim: true,
      default: "",
    },

    tagline: {
      type: String,
      trim: true,
      default: "",
    },

    desc: {
      type: [String],
      default: [],
    },

    keyProperties: {
      type: [String],
      default: [],
    },

    maxTemp: {
      type: String,
      trim: true,
      default: "",
    },

    minTemp: {
      type: String,
      trim: true,
      default: "",
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

// Automatically generate path and default title
materialSchema.pre("validate", function (next) {
  if (this.slug) {
    this.path = `/materials/${this.slug}`;
  }

  if (!this.title) {
    this.title = this.name;
  }

  next();
});

// Default ordering
materialSchema.index({ order: 1, name: 1 });

export default mongoose.model("Material", materialSchema);
