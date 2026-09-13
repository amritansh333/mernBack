import NewsEvent from "../../models/NewsEvent.js";

export const findPublishedBySlug = async (slug) => {
  return NewsEvent.findOne({ slug, status: "published" }).lean();
};

export const findPublishedList = async ({ type, tag, search, featured, sort, page = 1, limit = 12 } = {}) => {
  const query = { status: "published" };

  if (type) query.type = type;
  if (tag) query.tags = tag;
  if (featured) query.featured = true;

  let cursor = NewsEvent.find(query);

  if (search) {
    // use text search if available
    cursor = NewsEvent.find({ $text: { $search: search }, ...query });
  }

  // sorting
  if (sort === "oldest") {
    cursor = cursor.sort({ publishedAt: 1 });
  } else if (sort === "eventDate") {
    // for events, sort by event.startDate desc
    cursor = cursor.sort({ "event.startDate": -1, publishedAt: -1 });
  } else {
    // newest
    cursor = cursor.sort({ featured: -1, publishedAt: -1 });
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    cursor.skip(skip).limit(limit).lean(),
    NewsEvent.countDocuments(cursor.getQuery()),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { items, meta: { total, page, limit, totalPages, hasNextPage: page < totalPages } };
};

export const findRelated = async ({ currentId, tags = [], type, limit = 4 } = {}) => {
  const conditions = [];
  if (tags.length) {
    conditions.push({ tags: { $in: tags } });
  }
  if (type) {
    conditions.push({ type });
  }

  if (conditions.length === 0) return [];

  return NewsEvent.find({ _id: { $ne: currentId }, status: "published", $or: conditions })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
};

// Admin repository helpers
export const findById = (id) => NewsEvent.findById(id).lean();
export const createEntry = (data) => NewsEvent.create(data);
export const updateEntry = (id, data) => NewsEvent.findByIdAndUpdate(id, data, { new: true }).lean();
export const deleteEntry = (id) => NewsEvent.findByIdAndDelete(id);
export const listAll = async ({ limit = 100, page = 1 } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    NewsEvent.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    NewsEvent.countDocuments({}),
  ]);
  const totalPages = Math.ceil(total / limit);
  return { items, meta: { total, page, limit, totalPages } };
};
