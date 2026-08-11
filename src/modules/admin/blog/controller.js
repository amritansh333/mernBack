import * as service from "./service.js";

export const listBlogs = async (req, res) => {
  const result = await service.listBlogs(req);
  return res.apiSuccess(result.items, undefined, result.meta);
};

export const getBlog = async (req, res) => {
  const result = await service.getBlog(req.params.id);
  if (!result)
    return res
      .status(404)
      .json({ success: false, message: "Blog post not found" });
  return res.apiSuccess(result.item);
};

export const listCategories = async (req, res) => {
  const categories = await service.listCategories();
  return res.apiSuccess(categories);
};

export const createBlog = async (req, res) => {
  const result = await service.createBlog(req.body);
  return res.apiSuccess(result, "Blog post created successfully");
};

export const updateBlog = async (req, res) => {
  const result = await service.updateBlog(req.params.id, req.body);
  return res.apiSuccess(result, "Blog post updated successfully");
};

export const deleteBlog = async (req, res) => {
  await service.deleteBlog(req.params.id);
  return res.apiSuccess(null, "Blog post deleted successfully");
};

export const publishBlog = async (req, res) => {
  const result = await service.publishBlog(req.params.id);
  return res.apiSuccess(result, "Blog post published successfully");
};

export const unpublishBlog = async (req, res) => {
  const result = await service.unpublishBlog(req.params.id);
  return res.apiSuccess(result, "Blog post unpublished successfully");
};

export const duplicateBlog = async (req, res) => {
  const result = await service.duplicateBlog(req.params.id);
  return res.apiSuccess(result, "Blog post duplicated successfully");
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
