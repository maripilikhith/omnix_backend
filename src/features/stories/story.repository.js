import { BaseRepository } from '../../shared/base.repository.js';
import { StoryModel } from './story.model.js';

export class StoryRepository extends BaseRepository {
  constructor() { super(StoryModel); }

  async findByCourseId(courseId) {
    return this.findAllUnpaginated({ courseId }, { sort: { order: 1 } });
  }

  async findByTopicId(topicId) {
    return this.findAllUnpaginated({ topicId }, { sort: { order: 1 } });
  }

  async findAllWithPopulate() {
    return this.findAllUnpaginated(
      {},
      {
        sort: { sequence: 1 },
        populate: [
          { path: 'courseId', select: 'title courseSlug' },
          { path: 'moduleId', select: 'title moduleSlug' },
          { path: 'topicId', select: 'title topicSlug' },
        ],
      },
    );
  }
}

export const storyRepository = new StoryRepository();
