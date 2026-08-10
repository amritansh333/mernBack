import BlogPost from "../../models/BlogPost.js";

export const findPublishedBySlug = async (slug) => {
  return BlogPost.findOne({
    slug,
    status: "published",
  }).lean();
};

export const findPublishedPosts = async ({
  type,
  category,
  tag,
  limit = 50,
} = {}) => {
  const query = {
    status: "published",
  };

  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = tag;
  }

  return BlogPost.find(query)
    .sort({
      publishedAt: -1,
    })
    .limit(limit)
    .lean();
};

export const findRelatedPosts = async ({
  currentId,
  category,
  tags = [],
  limit = 3,
}) => {
  const conditions = [];

  if (category) {
    conditions.push({
      category,
    });
  }

  if (tags.length > 0) {
    conditions.push({
      tags: {
        $in: tags,
      },
    });
  }

  if (conditions.length === 0) {
    return [];
  }

  return BlogPost.find({
    _id: {
      $ne: currentId,
    },

    status: "published",

    $or: conditions,
  })
    .sort({
      publishedAt: -1,
    })
    .limit(limit)
    .lean();
};
