import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Project } from '@/modules/projects/models/Project';
import { ProjectRO } from '@/modules/projects/routes/RequestObject';

export abstract class IProjectService extends IBaseService<any> {
  createProject: (payload: ProjectRO) => Promise<number>;
  updateProject: (payload: ProjectRO, projetcId: number) => Promise<number>;
  getOrganizationProjects: (id: number) => Promise<Project[]>;
}
