import { NotFoundError } from '../utils/ApiError.js';
import { paginate, buildPaginationMeta } from '../utils/pagination.js';

/**
 * Abstract base repository providing standard CRUD operations.
 * Feature-specific repositories extend this class to inherit
 * common data access patterns while adding custom queries.
 *
 * Usage:
 *   class CourseRepository extends BaseRepository {
 *     constructor() { super(CourseModel); }
 *     async findPublished() { ... }
 *   }
 */
export class BaseRepository {
  /**
   * @param {import('mongoose').Model} model - Mongoose model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document.
   * @param {object} data
   * @returns {Promise<Document>}
   */
  async create(data) {
    const doc = new this.model(data);
    return doc.save();
  }

  /**
   * Find a single document by ID.
   * @param {string} id
   * @param {object} [options] - { populate, select }
   * @returns {Promise<Document>}
   * @throws {NotFoundError} if not found
   */
  async findById(id, options = {}) {
    let query = this.model.findById(id);
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    const doc = await query.exec();
    if (!doc) throw new NotFoundError(this.model.modelName);
    return doc;
  }

  /**
   * Find a single document matching a filter.
   * @param {object} filter
   * @param {object} [options]
   * @returns {Promise<Document|null>}
   */
  async findOne(filter, options = {}) {
    let query = this.model.findOne(filter);
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    return query.exec();
  }

  /**
   * Find all documents matching a filter with pagination.
   * @param {object} filter
   * @param {object} queryParams - req.query for pagination
   * @param {object} [options] - { populate, select, defaultSort }
   * @returns {Promise<{ data: Document[], meta: object }>}
   */
  async findAll(filter = {}, queryParams = {}, options = {}) {
    const { skip, limit, page, sort } = paginate(queryParams, {
      page: 1,
      limit: 20,
      sort: options.defaultSort || '-createdAt',
    });

    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  /**
   * Find all matching documents WITHOUT pagination.
   * Use sparingly — prefer paginated queries.
   */
  async findAllUnpaginated(filter = {}, options = {}) {
    let query = this.model.find(filter);
    if (options.sort) query = query.sort(options.sort);
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    return query.exec();
  }

  /**
   * Update a document by ID.
   * @param {string} id
   * @param {object} data
   * @returns {Promise<Document>}
   * @throws {NotFoundError} if not found
   */
  async updateById(id, data) {
    const doc = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new NotFoundError(this.model.modelName);
    return doc;
  }

  /**
   * Delete a document by ID.
   * @param {string} id
   * @returns {Promise<Document>}
   * @throws {NotFoundError} if not found
   */
  async deleteById(id) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundError(this.model.modelName);
    return doc;
  }

  /**
   * Count documents matching a filter.
   * @param {object} filter
   * @returns {Promise<number>}
   */
  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  /**
   * Check if a document exists.
   * @param {object} filter
   * @returns {Promise<boolean>}
   */
  async exists(filter) {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
