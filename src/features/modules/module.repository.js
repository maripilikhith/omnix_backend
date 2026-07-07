import { BaseRepository } from '../../shared/base.repository.js';
import { ModuleModel } from './module.model.js';

export class ModuleRepository extends BaseRepository {
  constructor() {
    super(ModuleModel);
  }

  async findByCourseId(courseId, publishedOnly = false) {
    const filter = { courseId };
    if (publishedOnly) filter.isPublished = true;
    return this.findAllUnpaginated(filter, { sort: { number: 1 } });
  }

  async findAllWithCourse() {
    return this.findAllUnpaginated(
      {},
      { sort: { sequence: 1 }, populate: { path: 'courseId', select: 'title courseSlug' } },
    );
  }
}

export const moduleRepository = new ModuleRepository();
