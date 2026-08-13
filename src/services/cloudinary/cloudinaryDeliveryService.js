import cloudinary from "../../config/cloudinary.js";

const normalizeResourceType = (resourceType = "image") => {
  if (!["image", "video", "raw"].includes(resourceType)) {
    throw new Error(
      `Unsupported Cloudinary resource type: ${resourceType}. Expected one of: image, video, raw.`,
    );
  }

  return resourceType;
};

export const getPublicAssetUrl = ({
  publicId,
  resourceType = "image",
  format,
}) => {
  if (!publicId || typeof publicId !== "string") {
    throw new Error("publicId is required to build a public Cloudinary URL");
  }

  return cloudinary.url(publicId, {
    resource_type: normalizeResourceType(resourceType),
    type: "upload",
    secure: true,
    format,
  });
};

export const getAuthenticatedAssetUrl = ({
  publicId,
  resourceType = "image",
  format,
  expiresInSeconds = 300,
}) => {
  if (!publicId || typeof publicId !== "string") {
    throw new Error("publicId is required to build an authenticated Cloudinary URL");
  }

  const expiresIn = Number(expiresInSeconds);

  if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new Error("expiresInSeconds must be a positive number");
  }

  const normalizedResourceType = normalizeResourceType(resourceType);
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: normalizedResourceType,
    type: "authenticated",
    expires_at: expiresAt,
    attachment: false,
  });
};

export default {
  getPublicAssetUrl,
  getAuthenticatedAssetUrl,
};
