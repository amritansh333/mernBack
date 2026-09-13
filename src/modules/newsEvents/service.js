import * as repo from "./repository.js";
import { serializeDetail, serializeListItem } from "./serializer.js";

export const getBySlug = async (slug) => {
  const doc = await repo.findPublishedBySlug(slug);
  if (!doc) {
    const error = new Error("Not found");
    error.statusCode = 404;
    throw error;
  }

  const related = await repo.findRelated({ currentId: doc._id, tags: doc.tags || [], type: doc.type, limit: 4 });

  return { item: serializeDetail(doc), related: related.map(serializeListItem) };
};

export const list = async (filters) => {
  const result = await repo.findPublishedList(filters);
  return { items: result.items.map(serializeListItem), meta: result.meta };
};

// Admin services
export const adminList = async (opts) => repo.listAll(opts);
export const adminGet = async (id) => repo.findById(id);
export const adminCreate = async (data) => repo.createEntry(data);
export const adminUpdate = async (id, data) => repo.updateEntry(id, data);
export const adminDelete = async (id) => repo.deleteEntry(id);
