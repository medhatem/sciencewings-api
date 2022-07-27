import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Project } from '@/modules/projects/models/Project';
import { ProjectRO } from '@/modules/projects/routes/RequestObject';
import { UserRequest } from '@/types/UserRequest';

export abstract class IProjectService extends IBaseService<any> {
  createProject: (request: UserRequest, payload: ProjectRO) => Promise<number>;
  updateProject: (payload: ProjectRO, projetcId: number) => Promise<number>;
  getOrganizationProjects: (id: number) => Promise<Project[]>;
}
