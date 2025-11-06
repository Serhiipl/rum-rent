import { v2 as cloudinary, ConfigOptions } from "cloudinary";

let isConfigured = false;

const ensureConfigured = () => {
  if (isConfigured) {
    return true;
  }

  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env;

  if (
    !CLOUDINARY_CLOUD_NAME ||
    !CLOUDINARY_API_KEY ||
    !CLOUDINARY_API_SECRET
  ) {
    console.warn(
      "Cloudinary credentials are missing; remote image cleanup will be skipped."
    );
    return false;
  }

  const config: ConfigOptions = {
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  };

  cloudinary.config(config);
  isConfigured = true;
  return true;
};

export const getCloudinary = () => {
  return ensureConfigured() ? cloudinary : null;
};

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) {
      return null;
    }

    const pathAfterUpload = url.substring(uploadIndex + "/upload/".length);
    const pathSegments = pathAfterUpload.split("/");

    if (pathSegments.length === 0) {
      return null;
    }

    // Strip version segment if present (e.g., v16987654321)
    if (/^v\d+$/.test(pathSegments[0])) {
      pathSegments.shift();
    }

    if (pathSegments.length === 0) {
      return null;
    }

    const publicIdWithExt = pathSegments.join("/");
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return publicIdWithExt;
    }

    return publicIdWithExt.substring(0, lastDotIndex);
  } catch (error) {
    console.warn("Failed to extract Cloudinary public ID from URL:", error);
    return null;
  }
};
