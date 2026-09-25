/**
 * Cloudinary & Responsive Image Optimization Utilities
 * Formats image URLs with automatic format (f_auto), quality (q_auto), and responsive widths.
 */

/**
 * Optimizes a Cloudinary image URL by injecting transformation parameters
 * @param {string} url - Original image URL
 * @param {Object} options - Transformation options
 * @param {number} [options.width] - Target width in pixels
 * @param {number} [options.height] - Target height in pixels
 * @param {string} [options.crop="fill"] - Crop mode (fill, scale, fit, thumb)
 * @param {string} [options.quality="auto"] - Quality setting (auto, best, good, eco)
 * @param {string} [options.format="auto"] - Format setting (auto, webp, avif)
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") return "";

  // If not a Cloudinary URL, return as-is
  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  const transformations = [];

  if (format) transformations.push(`f_${format}`);
  if (quality) transformations.push(`q_${quality}`);
  if (crop) transformations.push(`c_${crop}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);

  const transformString = transformations.join(",");
  return url.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Generates a responsive srcSet string for Cloudinary images
 * @param {string} url - Base Cloudinary URL
 * @param {number[]} [widths=[320, 640, 768, 1024, 1280, 1536]] - Breakpoint widths
 * @returns {string} srcSet string
 */
export function generateResponsiveSrcSet(url, widths = [320, 640, 768, 1024, 1280, 1536]) {
  if (!url || !url.includes("cloudinary.com") || !url.includes("/upload/")) {
    return "";
  }

  return widths
    .map((w) => `${getOptimizedImageUrl(url, { width: w })} ${w}w`)
    .join(", ");
}
