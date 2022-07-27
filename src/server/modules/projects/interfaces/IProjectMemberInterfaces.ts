import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { ProjectMemberRo } from '@/modules/projects/routes/RequestObject';
import { ProjectMember } from '@/modules/projects/models/ProjectMember';

export abstract class IProjectMemberService extends IBaseService<any> {
  createProjectMembers: (payload: ProjectMemberRo[], id: number) => Promise<ProjectMember[]>;
}
