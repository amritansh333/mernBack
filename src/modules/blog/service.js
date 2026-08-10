import {
  findPublishedBySlug,
  findPublishedPosts,
  findRelatedPosts,
} from "./repository.js";

import { serializeBlogPost, serializeBlogListItem } from "./serializer.js";

export const getBlogPostBySlug = async (slug) => {
  const post = await findPublishedBySlug(slug);

  if (!post) {
    const error = new Error("Blog post not found.");
    error.statusCode = 404;
    throw error;
  }

  const relatedPosts = await findRelatedPosts({
    currentId: post._id,
    category: post.category,
    tags: post.tags,
    limit: 3,
  });

  return {
    post: serializeBlogPost(post),

    relatedPosts: relatedPosts.map(serializeBlogListItem),
  };
};

export const listBlogPosts = async (filters) => {
  const posts = await findPublishedPosts(filters);

  return posts.map(serializeBlogListItem);
};
