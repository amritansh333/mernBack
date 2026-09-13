export const serializeListItem = (doc) => {
  return {
    id: doc._id,
    type: doc.type,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    coverImage: doc.coverImage,
    coverAlt: doc.coverAlt || doc.title,
    featured: !!doc.featured,
    tags: doc.tags || [],
    publishedAt: doc.publishedAt,
    event: doc.event || null,
  };
};

export const serializeDetail = (doc) => {
  return {
    id: doc._id,
    type: doc.type,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    body: doc.body,
    coverImage: doc.coverImage,
    coverAlt: doc.coverAlt || doc.title,
    gallery: doc.gallery || [],
    videos: doc.videos || [],
    tags: doc.tags || [],
    featured: !!doc.featured,
    status: doc.status,
    publishedAt: doc.publishedAt,
    event: doc.event || null,
    seo: doc.seo || {},
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};
