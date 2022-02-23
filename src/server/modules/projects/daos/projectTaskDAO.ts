import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '../../base/daos/BaseDao';
import { ProjectTask } from '../models/ProjetcTask';

@provideSingleton()
export class ProjectTaskDao extends BaseDao<ProjectTask> {
  private constructor(public model: ProjectTask) {
    super(model);
  }

  static getInstance(): ProjectTaskDao {
    return container.get(ProjectTaskDao);
  }
}
