import ContentEntry from "../../../models/ContentEntry.js";

export const listContent = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}) => {
  const q = (search || "").trim();
  const filter = {};
  if (q) {
    // prefer text search when available
    // Use $or fallback if text index isn't present in some deployments
    try {
      filter.$text = { $search: q };
    } catch (err) {
      // ignore
    }
  }
  if (status && status !== "all") {
    filter.status = status;
  }
  const skip = Math.max(0, page - 1) * limit;
  const [rows, total] = await Promise.all([
    ContentEntry.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ContentEntry.countDocuments(filter),
  ]);
  return {
    rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getContent = async (id) => ContentEntry.findById(id).lean();

export const createContent = async (data) => {
  const entry = new ContentEntry(data);
  await entry.save();
  return entry.toObject();
};

export const updateContent = async (id, data) => {
  const updated = await ContentEntry.findByIdAndUpdate(id, data, {
    new: true,
  }).lean();
  return updated;
};

export const deleteContent = async (id) => {
  await ContentEntry.findByIdAndDelete(id);
  return true;
};

export const bulkDeleteContent = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const res = await ContentEntry.deleteMany({ _id: { $in: ids } });
  return res.deletedCount || 0;
};

export const countContentEntries = () => ContentEntry.countDocuments({});

export const latestContent = (limit = 6) =>
  ContentEntry.find({}).sort({ updatedAt: -1 }).limit(limit).lean();

export default {
  listContent,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  bulkDeleteContent,
  countContentEntries,
  latestContent,
};
