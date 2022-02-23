import { container, provideSingleton } from '@/di/index';
import { BaseDao } from '../../base/daos/BaseDao';
import { ProjectTag } from '../models/ProjetcTag';

@provideSingleton()
export class ProjectTagDao extends BaseDao<ProjectTag> {
  private constructor(public model: ProjectTag) {
    super(model);
  }

  static getInstance(): ProjectTagDao {
    return container.get(ProjectTagDao);
  }
}
