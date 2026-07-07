import { BaseRepository } from '../../shared/base.repository.js';
import { TopicModel } from './topic.model.js';

export class TopicRepository extends BaseRepository {
  constructor() {
    super(TopicModel);
  }

  async findByCourseId(courseId, publishedOnly = false) {
    const filter = { courseId };
    if (publishedOnly) filter.isPublished = true;
    return this.findAllUnpaginated(filter, { sort: { number: 1 } });
  }

  async findByModuleId(moduleId) {
    return this.findAllUnpaginated({ moduleId }, { sort: { number: 1 } });
  }

  async findAllWithPopulate() {
    return this.findAllUnpaginated(
      {},
      {
        sort: { sequence: 1 },
        populate: [
          { path: 'courseId', select: 'title courseSlug' },
          { path: 'moduleId', select: 'title moduleSlug' },
        ],
      },
    );
  }
}

export const topicRepository = new TopicRepository();
