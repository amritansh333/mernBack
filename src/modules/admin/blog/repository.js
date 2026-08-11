import BlogPost from "../../../models/BlogPost.js";

export const count = (query = {}) => BlogPost.countDocuments(query);

export const find = (query = {}, opts = {}) => {
  const { sort = { publishedAt: -1 }, skip = 0, limit = 10 } = opts;
  return BlogPost.find(query).sort(sort).skip(skip).limit(limit).lean();
};

export const findById = (id) => BlogPost.findById(id).lean();

export const findOne = (query) => BlogPost.findOne(query).lean();

export const create = (payload) => new BlogPost(payload).save();

export const updateById = (id, payload) =>
  BlogPost.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

export const deleteById = (id) => BlogPost.findByIdAndDelete(id);

export const distinctCategories = () => BlogPost.distinct("category");

export default {
  count,
  find,
  findById,
  findOne,
  create,
  updateById,
  deleteById,
  distinctCategories,
};
