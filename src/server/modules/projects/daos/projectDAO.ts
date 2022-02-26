import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { Project } from '@/modules/projects/models/Project';

@provideSingleton()
export class ProjectDao extends BaseDao<Project> {
  private constructor(public model: Project) {
    super(model);
  }

  static getInstance(): ProjectDao {
    return container.get(ProjectDao);
  }
}
