import { Project } from './../models/Project';
import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '../../base/daos/BaseDao';

@provideSingleton()
export class ProjectDao extends BaseDao<Project> {
  private constructor(public model: Project) {
    super(model);
  }

  static getInstance(): ProjectDao {
    return container.get(ProjectDao);
  }
}
