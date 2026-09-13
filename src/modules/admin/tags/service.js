import Tag from '../../../models/Tag.js';

export const list = async () => Tag.find({}).sort({ name: 1 }).lean();
export const getById = async (id) => Tag.findById(id).lean();
export const create = async (data) => Tag.create(data);
export const update = async (id, data) => Tag.findByIdAndUpdate(id, data, { new: true }).lean();
export const remove = async (id) => Tag.findByIdAndDelete(id);
