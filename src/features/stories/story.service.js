import { BaseService } from '../../shared/base.service.js';
import { storyRepository } from './story.repository.js';

export class StoryService extends BaseService {
  constructor() { super(storyRepository); }
  async getStoriesByCourse(courseId) { return this.repository.findByCourseId(courseId); }
  async getStoriesByTopic(topicId) { return this.repository.findByTopicId(topicId); }
  async getAllStoriesAdmin() { return this.repository.findAllWithPopulate(); }
  async createStory(data) { return this.repository.create(data); }
  async updateStory(id, data) { return this.repository.updateById(id, data); }
  async deleteStory(id) { return this.repository.deleteById(id); }
}

export const storyService = new StoryService();
