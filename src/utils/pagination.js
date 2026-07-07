/**
 * Build a Mongoose pagination query from request query params.
 *
 * @param {object} query - Express req.query
 * @param {object} [defaults] - Default page/limit
 * @returns {{ skip: number, limit: number, page: number, sort: object }}
 */
export function paginate(query, defaults = { page: 1, limit: 20, sort: '-createdAt' }) {
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaults.limit));
  const skip = (page - 1) * limit;

  // Parse sort: "field" → asc, "-field" → desc, comma-separated
  const sortStr = query.sort || defaults.sort;
  const sort = {};
  sortStr.split(',').forEach((field) => {
    if (field.startsWith('-')) {
      sort[field.substring(1)] = -1;
    } else {
      sort[field] = 1;
    }
  });

  return { skip, limit, page, sort };
}

/**
 * Build pagination metadata for API response.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total matching documents
 * @returns {object} Pagination meta object
 */
export function buildPaginationMeta(page, limit, total) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
