import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env.js";

// Initialize Cloudinary if credentials are configured
const isCloudinaryConfigured = Boolean(
  env.cloudinaryUrl ||
  (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret)
);

if (isCloudinaryConfigured) {
  if (env.cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: env.cloudinaryUrl,
      secure: true,
    });
  } else {
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      secure: true,
    });
  }
}

export const cloudinaryService = {
  isConfigured: () => isCloudinaryConfigured,

  /**
   * Upload an image buffer directly to Cloudinary
   * @param {Buffer} buffer File buffer from multer memory storage
   * @param {Object} options Upload options (folder, tags, publicId)
   * @returns {Promise<{ url: string, secureUrl: string, publicId: string, width: number, height: number, bytes: number, format: string }>}
   */
  async uploadImageBuffer(buffer, options = {}) {
    const folder = options.folder || "portfolio/projects";

    // If Cloudinary credentials are fully configured, stream to Cloudinary
    if (isCloudinaryConfigured) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
            transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
            ...options,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve({
              url: result.secure_url || result.url,
              secureUrl: result.secure_url || result.url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
              format: result.format,
            });
          }
        );

        uploadStream.end(buffer);
      });
    }

    // Graceful offline / development fallback: Return base64 data URI
    const mimeType = options.mimeType || "image/jpeg";
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      url: dataUrl,
      secureUrl: dataUrl,
      publicId: `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      width: 1200,
      height: 800,
      bytes: buffer.length,
      format: mimeType.split("/")[1] || "jpeg",
    };
  },

  /**
   * Delete an asset by publicId from Cloudinary
   * @param {string} publicId
   */
  async deleteAsset(publicId) {
    if (!isCloudinaryConfigured || !publicId || publicId.startsWith("dev_")) {
      return { result: "ok" };
    }
    return cloudinary.uploader.destroy(publicId);
  },
};
