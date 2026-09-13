import * as repo from "../../newsEvents/repository.js";

export const listAll = async (opts) => repo.listAll(opts);
export const getById = async (id) => repo.findById(id);
export const create = async (data) => repo.createEntry(data);
export const update = async (id, data) => repo.updateEntry(id, data);
export const remove = async (id) => repo.deleteEntry(id);
export const publish = async (id) => repo.updateEntry(id, { status: 'published', publishedAt: new Date() });
export const unpublish = async (id) => repo.updateEntry(id, { status: 'draft' });
export const setFeatured = async (id, featured) => repo.updateEntry(id, { featured });
