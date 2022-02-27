import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ProjectTag } from '@/modules/projects/models/ProjectTag';

@provideSingleton()
export class ProjectTagDao extends BaseDao<ProjectTag> {
  private constructor(public model: ProjectTag) {
    super(model);
  }

  static getInstance(): ProjectTagDao {
    return container.get(ProjectTagDao);
  }
}
