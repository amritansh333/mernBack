import mongoose from "mongoose";

const { Schema } = mongoose;

const articleSectionSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    paragraphs: {
      type: [String],
      default: [],
    },

    bullets: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const seoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 160,
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 320,
    },

    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const blogPostSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["Blog", "Gallery"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    publishedAt: {
      type: Date,
      required: true,
      index: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    readTimeMinutes: {
      type: Number,
      required: true,
      min: 1,
      max: 180,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    intro: {
      type: String,
      required: true,
      trim: true,
    },

    sections: {
      type: [articleSectionSchema],
      default: [],
    },

    keyTakeaways: {
      type: [String],
      default: [],
    },

    galleryImages: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    seo: {
      type: seoSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

blogPostSchema.index({
  status: 1,
  publishedAt: -1,
});

blogPostSchema.index({
  category: 1,
  status: 1,
  publishedAt: -1,
});

blogPostSchema.index({
  tags: 1,
  status: 1,
  publishedAt: -1,
});

export default mongoose.model("BlogPost", blogPostSchema);
