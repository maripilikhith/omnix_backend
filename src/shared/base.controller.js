import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Abstract base controller with standard CRUD handler methods.
 * Feature controllers extend this and override/add methods as needed.
 *
 * Every method follows the thin controller pattern:
 *   1. Extract input from request
 *   2. Call service method
 *   3. Return standardized response
 */
export class BaseController {
  /**
   * @param {import('./base.service.js').BaseService} service
   */
  constructor(service) {
    this.service = service;

    // Bind methods to preserve `this` context when used as route handlers
    this.create = this.create.bind(this);
    this.findById = this.findById.bind(this);
    this.findAll = this.findAll.bind(this);
    this.updateById = this.updateById.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  /**
   * POST / — Create a new resource
   */
  async create(req, res) {
    const data = await this.service.create(req.body);
    return ApiResponse.created(res, data);
  }

  /**
   * GET /:id — Get a single resource
   */
  async findById(req, res) {
    const data = await this.service.findById(req.params.id);
    return ApiResponse.success(res, data);
  }

  /**
   * GET / — List resources with pagination
   */
  async findAll(req, res) {
    const { data, meta } = await this.service.findAll({}, req.query);
    return ApiResponse.success(res, data, HTTP_STATUS.OK, meta);
  }

  /**
   * PUT /:id — Update a resource
   */
  async updateById(req, res) {
    const data = await this.service.updateById(req.params.id, req.body);
    return ApiResponse.success(res, data);
  }

  /**
   * DELETE /:id — Delete a resource
   */
  async deleteById(req, res) {
    await this.service.deleteById(req.params.id);
    return ApiResponse.success(res, { message: `${this.service.repository.model.modelName} deleted successfully` });
  }
}
