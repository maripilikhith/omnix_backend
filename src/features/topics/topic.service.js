import { BaseService } from '../../shared/base.service.js';
import { topicRepository } from './topic.repository.js';

export class TopicService extends BaseService {
  constructor() { super(topicRepository); }

  async getTopicsByCourse(courseId, publishedOnly = false) {
    return this.repository.findByCourseId(courseId, publishedOnly);
  }
  async getTopicsByModule(moduleId) {
    return this.repository.findByModuleId(moduleId);
  }
  async getAllTopicsAdmin() {
    return this.repository.findAllWithPopulate();
  }
  async createTopic(data) { return this.repository.create(data); }
  async updateTopic(id, data) { return this.repository.updateById(id, data); }
  async deleteTopic(id) { return this.repository.deleteById(id); }
}

export const topicService = new TopicService();
