export const validatePagination = (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(200, Number(query.limit) || 20));
  return { page, limit };
};

export const slugifyIndustry = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const normalizeIndustryPayload = (payload = {}) => {
  const raw = payload && typeof payload === "object" ? payload : {};
  const seoInput = raw.seo && typeof raw.seo === "object" ? raw.seo : {};
  const keywords = Array.isArray(raw.keywords)
    ? raw.keywords
    : typeof raw.keywords === "string"
      ? raw.keywords.split(",")
      : Array.isArray(seoInput.keywords)
        ? seoInput.keywords
        : typeof seoInput.keywords === "string"
          ? seoInput.keywords.split(",")
          : [];

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name) {
    throw { status: 400, message: "Industry name is required" };
  }

  const slugValue =
    typeof raw.slug === "string" ? raw.slug.trim().toLowerCase() : "";
  const slug = slugValue || slugifyIndustry(name);
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw {
      status: 400,
      message: "Slug must be lowercase, URL-safe, and use hyphen separators",
    };
  }

  const description =
    typeof raw.description === "string" ? raw.description.trim() : "";
  const metaTitle =
    typeof seoInput.metaTitle === "string" ? seoInput.metaTitle.trim() : "";
  const metaDescription =
    typeof seoInput.metaDescription === "string"
      ? seoInput.metaDescription.trim()
      : "";

  return {
    name,
    slug,
    description,
    seo: {
      metaTitle,
      metaDescription,
      keywords: keywords
        .map((keyword) => String(keyword).trim())
        .filter(Boolean),
    },
  };
};

export default {
  validatePagination,
  slugifyIndustry,
  normalizeIndustryPayload,
};
