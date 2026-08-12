import { getBlogPostBySlug, listBlogPosts } from "./service.js";

import { validateListQuery, validateSlugParam } from "./validator.js";

export const getBlogPost = async (req, res, next) => {
  try {
    const slug = validateSlugParam(req.params.slug);

    const result = await getBlogPostBySlug(slug);

    return res.status(200).json({
      success: true,
      message: "Blog post fetched successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getBlogPosts = async (req, res, next) => {
  try {
    const filters = validateListQuery(req.query);

    const posts = await listBlogPosts(filters);

    return res.status(200).json({
      success: true,
      message: "Blog posts fetched successfully.",
      data: posts,
    });
  } catch (error) {
    return next(error);
  }
};
