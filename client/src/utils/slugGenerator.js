/**
 * Generates a clean, URL-safe slug from a string
 * @param {string} text
 * @returns {string}
 */
export function generateSlug(text) {
  if (!text || typeof text !== "string") return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters (except spaces and hyphens)
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}
