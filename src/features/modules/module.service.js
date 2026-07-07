import { BaseService } from '../../shared/base.service.js';
import { moduleRepository } from './module.repository.js';

export class ModuleService extends BaseService {
  constructor() {
    super(moduleRepository);
  }

  async getModulesByCourse(courseId, publishedOnly = false) {
    return this.repository.findByCourseId(courseId, publishedOnly);
  }

  async getAllModulesAdmin() {
    return this.repository.findAllWithCourse();
  }

  async createModule(data) {
    return this.repository.create(data);
  }

  async updateModule(id, data) {
    return this.repository.updateById(id, data);
  }

  async deleteModule(id) {
    return this.repository.deleteById(id);
  }
}

export const moduleService = new ModuleService();
