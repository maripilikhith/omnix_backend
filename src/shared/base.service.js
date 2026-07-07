/**
 * Abstract base service.
 * Provides a standard interface for feature services.
 * Feature services extend this to add business logic.
 *
 * The base service delegates data access to a repository,
 * keeping the service layer focused on orchestration and business rules.
 */
export class BaseService {
  /**
   * @param {import('./base.repository.js').BaseRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    return this.repository.create(data);
  }

  async findById(id, options) {
    return this.repository.findById(id, options);
  }

  async findOne(filter, options) {
    return this.repository.findOne(filter, options);
  }

  async findAll(filter, queryParams, options) {
    return this.repository.findAll(filter, queryParams, options);
  }

  async updateById(id, data) {
    return this.repository.updateById(id, data);
  }

  async deleteById(id) {
    return this.repository.deleteById(id);
  }

  async count(filter) {
    return this.repository.count(filter);
  }

  async exists(filter) {
    return this.repository.exists(filter);
  }
}
