import * as repo from "./repository.js";
import { serializeBlog, serializeBlogListItem } from "./serializer.js";
import {
  validateBlogPayload,
  validatePagination,
  validateSort,
  normalizeSlug,
} from "./validator.js";
import * as systemLogsRepo from "../system-logs/repository.js";

const createAudit = async (message, meta = {}) => {
  try {
    await systemLogsRepo.create({
      level: "info",
      message,
      source: "admin.blog",
      meta,
    });
  } catch {
    // Do not fail blog operations if audit logging fails.
  }
};

export const listBlogs = async (req) => {
  const { page, limit } = validatePagination(req.query);
  const { field, dir } = validateSort(req.query.sort);
  const sort = { [field]: dir };

  const query = {};

  if (req.query.search) {
    const regex = { $regex: String(req.query.search), $options: "i" };
    query.$or = [
      { title: regex },
      { slug: regex },
      { excerpt: regex },
      { category: regex },
      { tags: regex },
    ];
  }

  if (req.query.type && ["Blog", "Gallery"].includes(req.query.type)) {
    query.type = req.query.type;
  }

  if (req.query.status) {
    const status = String(req.query.status).trim().toLowerCase();
    if (["draft", "published"].includes(status)) {
      query.status = status;
    }
  }

  if (req.query.category) {
    query.category = {
      $regex: String(req.query.category).trim(),
      $options: "i",
    };
  }

  const [total, items] = await Promise.all([
    repo.count(query),
    repo.find(query, { sort, skip: (page - 1) * limit, limit }),
  ]);

  return {
    items: items.map(serializeBlogListItem),
    meta: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  };
};

export const getBlog = async (id) => {
  const item = await repo.findById(id);
  if (!item) return null;
  return { item: serializeBlog(item) };
};

export const listCategories = async () => {
  const categories = await repo.distinctCategories();
  return categories.filter(Boolean).map((category) => String(category));
};

export const createBlog = async (payload) => {
  const blog = validateBlogPayload(payload);
  const existing = await repo.findOne({ slug: blog.slug });
  if (existing) throw { status: 409, message: "Duplicate slug" };

  const created = await repo.create(blog);
  await createAudit("Created blog post", {
    slug: blog.slug,
    title: blog.title,
  });
  return serializeBlog(created);
};

export const updateBlog = async (id, payload) => {
  const blog = validateBlogPayload(payload);
  const existing = await repo.findOne({ slug: blog.slug, _id: { $ne: id } });
  if (existing) throw { status: 409, message: "Duplicate slug" };

  const updated = await repo.updateById(id, blog);
  if (!updated) throw { status: 404, message: "Blog post not found" };

  await createAudit("Updated blog post", {
    id,
    slug: blog.slug,
    title: blog.title,
  });
  return serializeBlog(updated);
};

export const deleteBlog = async (id) => {
  const removed = await repo.deleteById(id);
  if (!removed) throw { status: 404, message: "Blog post not found" };
  await createAudit("Deleted blog post", {
    id,
    slug: removed.slug,
    title: removed.title,
  });
  return removed;
};

export const publishBlog = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Blog post not found" };

  const payload = {
    ...existing,
    status: "published",
    publishedAt: existing.publishedAt || new Date(),
  };

  const normalized = validateBlogPayload(payload);
  const updated = await repo.updateById(id, normalized);
  if (!updated) throw { status: 404, message: "Blog post not found" };

  await createAudit("Published blog post", {
    id,
    slug: normalized.slug,
    title: normalized.title,
  });
  return serializeBlog(updated);
};

export const unpublishBlog = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Blog post not found" };

  const updated = await repo.updateById(id, { status: "draft" });
  if (!updated) throw { status: 404, message: "Blog post not found" };

  await createAudit("Unpublished blog post", {
    id,
    slug: existing.slug,
    title: existing.title,
  });
  return serializeBlog(updated);
};

const generateUniqueSlug = async (baseSlug) => {
  const slug = normalizeSlug(baseSlug);
  let candidate = slug;
  let counter = 1;

  while (await repo.findOne({ slug: candidate })) {
    candidate = `${slug}-copy${counter > 1 ? `-${counter}` : ""}`;
    counter += 1;
  }

  return candidate;
};

export const duplicateBlog = async (id) => {
  const existing = await repo.findById(id);
  if (!existing) throw { status: 404, message: "Blog post not found" };

  const duplicateSlug = await generateUniqueSlug(
    existing.slug || existing.title,
  );
  const duplicatePayload = {
    title: `${existing.title} (Copy)`,
    slug: duplicateSlug,
    type: existing.type,
    category: existing.category,
    excerpt: existing.excerpt,
    image: existing.image,
    readTimeMinutes: existing.readTimeMinutes,
    intro: existing.intro,
    sections: existing.sections,
    keyTakeaways: existing.keyTakeaways,
    galleryImages: existing.galleryImages,
    tags: existing.tags,
    status: "draft",
    publishedAt: new Date(),
    seo: existing.seo || {},
  };

  const created = await repo.create(duplicatePayload);
  await createAudit("Duplicated blog post", {
    sourceId: id,
    newId: String(created._id),
    slug: duplicateSlug,
    title: duplicatePayload.title,
  });
  return serializeBlog(created);
};

export default {
  listBlogs,
  getBlog,
  listCategories,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  duplicateBlog,
};
