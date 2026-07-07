/**
 * Generate a URL-safe slug from a string.
 *
 * @param {string} text - Input text
 * @returns {string} Slugified string
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')    // Remove non-word characters
    .replace(/--+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+/, '')         // Trim leading hyphens
    .replace(/-+$/, '');        // Trim trailing hyphens
}
