import mongoose from "mongoose";

const { Schema } = mongoose;

const seoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 160 },
    metaDescription: { type: String, trim: true, maxlength: 320 },
    keywords: { type: [String], default: [] },
  },
  { _id: false },
);

const galleryItemSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    caption: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const videoSchema = new Schema(
  {
    provider: { type: String, enum: ["youtube", "vimeo", "hosted"], required: true },
    videoId: { type: String, required: true, trim: true },
    title: { type: String, default: "", trim: true },
    caption: { type: String, default: "", trim: true },
    poster: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const eventInfoSchema = new Schema(
  {
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    venue: { type: String, default: "", trim: true },
    booth: { type: String, default: "", trim: true },
    eventWebsite: { type: String, default: "", trim: true },
    registrationUrl: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const newsEventSchema = new Schema(
  {
    type: { type: String, enum: ["News", "Event"], required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    excerpt: { type: String, default: "", trim: true, maxlength: 1000 },
    body: { type: String, default: "" },
    coverImage: { type: String, default: "", trim: true },
    coverAlt: { type: String, default: "", trim: true },
    gallery: { type: [galleryItemSchema], default: [] },
    videos: { type: [videoSchema], default: [] },
    tags: { type: [String], default: [], index: true }, // store tag slugs for compatibility
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    publishedAt: { type: Date, index: true },
    event: { type: eventInfoSchema, default: {} },
    seo: { type: seoSchema, default: {} },
  },
  { timestamps: true },
);

// text index for search across important fields
newsEventSchema.index({ title: "text", excerpt: "text", body: "text" });

// composite indexes for queries
newsEventSchema.index({ status: 1, publishedAt: -1 });
newsEventSchema.index({ tags: 1, status: 1, publishedAt: -1 });

export default mongoose.model("NewsEvent", newsEventSchema);
