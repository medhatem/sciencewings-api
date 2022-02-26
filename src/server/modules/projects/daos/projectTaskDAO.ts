import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ProjectTask } from '@/modules/projects/models/ProjetcTask';

@provideSingleton()
export class ProjectTaskDao extends BaseDao<ProjectTask> {
  private constructor(public model: ProjectTask) {
    super(model);
  }

  static getInstance(): ProjectTaskDao {
    return container.get(ProjectTaskDao);
  }
}
