import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { ProjectMember } from '@/modules/projects/models/ProjectMember';
import { ProjectMemberDao } from '@/modules/projects/daos/projectMemberDao';
import { IProjectMemberService } from '@/modules/projects/interfaces/IProjectMemberInterfaces';
@provideSingleton(IProjectMemberService)
export class ProjectMemberService extends BaseService<ProjectMember> implements IProjectMemberService {
  constructor(public dao: ProjectMemberDao) {
    super(dao);
  }

  static getInstance(): IProjectMemberService {
    return container.get(IProjectMemberService);
  }
}
