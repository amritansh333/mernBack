const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatReadTime = (minutes) => {
  if (!minutes) {
    return "";
  }

  return `${minutes} min read`;
};

const serializeSection = (section) => ({
  heading: section?.heading || "",

  paragraphs: Array.isArray(section?.paragraphs) ? section.paragraphs : [],

  bullets: Array.isArray(section?.bullets) ? section.bullets : [],
});

export const serializeBlogPost = (post) => {
  if (!post) {
    return null;
  }

  return {
    id: String(post._id),

    slug: post.slug,

    type: post.type,

    title: post.title,

    date: formatDate(post.publishedAt),

    publishedAt: post.publishedAt,

    image: post.image,

    excerpt: post.excerpt,

    tags: Array.isArray(post.tags) ? post.tags : [],

    readTime: formatReadTime(post.readTimeMinutes),

    readTimeMinutes: post.readTimeMinutes,

    category: post.category,

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
      : null,
  };
};

export const serializeBlogListItem = (post) => {
  if (!post) {
    return null;
  }

  return {
    id: String(post._id),

    slug: post.slug,

    type: post.type,

    title: post.title,

    date: formatDate(post.publishedAt),

    publishedAt: post.publishedAt,

    image: post.image,

    excerpt: post.excerpt,

    tags: Array.isArray(post.tags) ? post.tags : [],

    readTime: formatReadTime(post.readTimeMinutes),

    category: post.category,
  };
};
