import { BaseRepository } from '../../shared/base.repository.js';
import { ExplainerModel } from './explainer.model.js';

export class ExplainerRepository extends BaseRepository {
  constructor() { super(ExplainerModel); }

  async findByCourseId(courseId, publishedOnly = false) {
    const filter = { courseId };
    if (publishedOnly) filter.isPublished = true;
    return this.findAllUnpaginated(filter, { sort: { order: 1 } });
  }

  async findByTopicId(topicId) {
    return this.findAllUnpaginated({ topicId }, { sort: { order: 1 } });
  }

  async findAllWithPopulate() {
    return this.findAllUnpaginated(
      {},
      {
        sort: { order: 1 },
        populate: [
          { path: 'courseId', select: 'title courseSlug' },
          { path: 'moduleId', select: 'title moduleSlug' },
          { path: 'topicId', select: 'title topicSlug' },
        ],
      },
    );
  }
}

export const explainerRepository = new ExplainerRepository();
