import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validatePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(200, Number(query.limit) || 20));
  return { page, limit };
};

export const validateSort = (sortParam, defaultSort = "publishedAt:desc") => {
  const sortStr = sortParam || defaultSort;
  const [field, dir] = sortStr.split(":");
  const allowedFields = ["publishedAt", "updatedAt", "title", "category"];
  if (!allowedFields.includes(field)) {
    return { field: "publishedAt", dir: dir === "asc" ? 1 : -1 };
  }

  return { field: field || "publishedAt", dir: dir === "desc" ? -1 : 1 };
};

export const validateId = (id) => !!id && isValidObjectId(id);

export const normalizeSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").trim())
    .filter((item) => item.length > 0);
};

const normalizeSections = (sections) => {
  if (!Array.isArray(sections)) return [];
  return sections
    .map((section) => {
      const heading = String(section?.heading || "").trim();
      const paragraphs = normalizeStringArray(section?.paragraphs);
      const bullets = normalizeStringArray(section?.bullets);
      return { heading, paragraphs, bullets };
    })
    .filter((section) => section.heading.length > 0);
};

export const validateBlogPayload = (payload) => {
  const title = String(payload.title || "").trim();
  if (!title) throw { status: 400, message: "Title is required" };

  const slug = normalizeSlug(payload.slug || title);
  if (!slug) throw { status: 400, message: "Valid slug is required" };

  const type = String(payload.type || "").trim();
  if (!["Blog", "Gallery"].includes(type)) {
    throw { status: 400, message: "Invalid type. Use Blog or Gallery." };
  }

  const category = String(payload.category || "").trim();
  if (!category) throw { status: 400, message: "Category is required" };

  const excerpt = String(payload.excerpt || "").trim();
  if (!excerpt) throw { status: 400, message: "Excerpt is required" };

  const image = String(payload.image || "").trim();
  if (!image) throw { status: 400, message: "Featured image is required" };

  const readTimeMinutes = Number(
    payload.readTimeMinutes ?? payload.readTime ?? 0,
  );
  if (
    !Number.isFinite(readTimeMinutes) ||
    readTimeMinutes < 1 ||
    readTimeMinutes > 180
  ) {
    throw {
      status: 400,
      message: "Read time must be a number between 1 and 180",
    };
  }

  const intro = String(payload.intro || "").trim();
  if (!intro) throw { status: 400, message: "Intro is required" };

  const tags = Array.isArray(payload.tags)
    ? Array.from(new Set(normalizeStringArray(payload.tags)))
    : [];

  const keyTakeaways = normalizeStringArray(payload.keyTakeaways);
  const sections = normalizeSections(payload.sections);
  const galleryImages = Array.isArray(payload.galleryImages)
    ? payload.galleryImages
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    : [];

  const status = String(payload.status || "draft")
    .trim()
    .toLowerCase();
  if (!["draft", "published"].includes(status)) {
    throw { status: 400, message: "Invalid status. Use draft or published." };
  }

  const publishedAt = payload.publishedAt
    ? new Date(payload.publishedAt)
    : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    throw { status: 400, message: "publishedAt must be a valid date." };
  }

  const seo = payload.seo && typeof payload.seo === "object" ? payload.seo : {};
  const metaTitle = String(seo.metaTitle || "").trim();
  const metaDescription = String(seo.metaDescription || "").trim();
  const keywords = Array.isArray(seo.keywords)
    ? Array.from(new Set(normalizeStringArray(seo.keywords)))
    : [];

  return {
    title,
    slug,
    type,
    category,
    excerpt,
    image,
    readTimeMinutes,
    intro,
    tags,
    keyTakeaways,
    sections,
    galleryImages: type === "Gallery" ? galleryImages : [],
    status,
    publishedAt,
    seo: { metaTitle, metaDescription, keywords },
  };
};

export default {
  validatePagination,
  validateSort,
  validateId,
  validateBlogPayload,
  normalizeSlug,
};
