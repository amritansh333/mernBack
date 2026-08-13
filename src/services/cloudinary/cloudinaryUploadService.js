import cloudinary from "../../config/cloudinary.js";

const validResourceTypes = new Set(["image", "video", "raw"]);
const validDeliveryTypes = new Set(["upload", "authenticated"]);

const normalizeResourceType = (resourceType) => {
  if (!resourceType || !validResourceTypes.has(resourceType)) {
    throw new Error(
      `Unsupported Cloudinary resource type: ${resourceType}. Expected one of: image, video, raw.`,
    );
  }

  return resourceType;
};

const normalizeDeliveryType = (deliveryType) => {
  if (!deliveryType || !validDeliveryTypes.has(deliveryType)) {
    throw new Error(
      `Unsupported Cloudinary delivery type: ${deliveryType}. Expected one of: upload, authenticated.`,
    );
  }

  return deliveryType;
};

export const uploadAsset = async ({
  filePath,
  folder,
  publicId,
  resourceType = "image",
  type = "upload",
  deliveryType = type,
  overwrite = true,
  invalidate = false,
}) => {
  if (!filePath || typeof filePath !== "string") {
    throw new Error("filePath is required for Cloudinary upload");
  }

  if (!folder || typeof folder !== "string") {
    throw new Error("folder is required for Cloudinary upload");
  }

  if (!publicId || typeof publicId !== "string") {
    throw new Error("publicId is required for Cloudinary upload");
  }

  const normalizedResourceType = normalizeResourceType(resourceType);
  const normalizedDeliveryType = normalizeDeliveryType(deliveryType ?? type);

  return cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    resource_type: normalizedResourceType,
    type: normalizedDeliveryType,
    overwrite,
    invalidate,
  });
};

export default {
  uploadAsset,
};
