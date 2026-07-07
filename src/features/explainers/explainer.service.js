import { BaseService } from '../../shared/base.service.js';
import { explainerRepository } from './explainer.repository.js';

export class ExplainerService extends BaseService {
  constructor() { super(explainerRepository); }
  async getExplainersByCourse(courseId, publishedOnly = false) { return this.repository.findByCourseId(courseId, publishedOnly); }
  async getExplainersByTopic(topicId) { return this.repository.findByTopicId(topicId); }
  async getAllExplainersAdmin() { return this.repository.findAllWithPopulate(); }
  async createExplainer(data) { return this.repository.create(data); }
  async updateExplainer(id, data) { return this.repository.updateById(id, data); }
  async deleteExplainer(id) { return this.repository.deleteById(id); }
}

export const explainerService = new ExplainerService();
