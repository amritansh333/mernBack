const formatReadTime = (minutes) => {
  if (minutes === undefined || minutes === null) return "";
  return `${minutes} min read`;
};

const serializeSection = (section) => ({
  heading: section?.heading || "",
  paragraphs: Array.isArray(section?.paragraphs) ? section.paragraphs : [],
  bullets: Array.isArray(section?.bullets) ? section.bullets : [],
});

export const serializeBlogListItem = (post) => {
  if (!post) return null;

  return {
    id: String(post._id),
    slug: post.slug,
    type: post.type,
    title: post.title,
    status: post.status === "published" ? "Published" : "Draft",
    category: post.category,
    image: post.image,
    excerpt: post.excerpt,
    tags: Array.isArray(post.tags) ? post.tags : [],
    readTime: formatReadTime(post.readTimeMinutes),
    readTimeMinutes: post.readTimeMinutes,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    createdAt: post.createdAt,
  };
};

export const serializeBlog = (post) => {
  if (!post) return null;

  return {
    id: String(post._id),
    slug: post.slug,
    type: post.type,
    title: post.title,
    status: post.status === "published" ? "Published" : "Draft",
    category: post.category,
    image: post.image,
    excerpt: post.excerpt,
    tags: Array.isArray(post.tags) ? post.tags : [],
    readTime: formatReadTime(post.readTimeMinutes),
    readTimeMinutes: post.readTimeMinutes,
    intro: post.intro,
    sections: Array.isArray(post.sections)
      ? post.sections.map(serializeSection)
      : [],
    keyTakeaways: Array.isArray(post.keyTakeaways) ? post.keyTakeaways : [],
    galleryImages: Array.isArray(post.galleryImages) ? post.galleryImages : [],
    seo: post.seo
      ? {
          metaTitle: post.seo.metaTitle || "",
          metaDescription: post.seo.metaDescription || "",
          keywords: Array.isArray(post.seo.keywords) ? post.seo.keywords : [],
        }
      : { metaTitle: "", metaDescription: "", keywords: [] },
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    createdAt: post.createdAt,
  };
};

export default { serializeBlog, serializeBlogListItem };
