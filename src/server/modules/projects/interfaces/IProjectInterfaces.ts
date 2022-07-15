import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { ProjectRO } from '@/modules/projects/routes/RequestObject';
import { Result } from '@/utils/Result';
import { Project } from '@/modules/projects/models/Project';

export abstract class IProjectService extends IBaseService<any> {
  createProject: (payload: ProjectRO) => Promise<Result<number>>;
  updateProject: (payload: ProjectRO, projetcId: number) => Promise<Result<number>>;
  getAllProjects: () => Promise<Result<Project[]>>;
}
