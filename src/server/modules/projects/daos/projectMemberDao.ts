import { container, provideSingleton } from '@/di/index';

import { BaseDao } from '@/modules/base/daos/BaseDao';
import { ProjectMember } from '@/modules/projects/models/ProjectMember';

@provideSingleton()
export class ProjectMemberDao extends BaseDao<ProjectMember> {
  private constructor(public model: ProjectMember) {
    super(model);
  }

  static getInstance(): ProjectMemberDao {
    return container.get(ProjectMemberDao);
  }
}
