// import { Project } from './../models/Project';
import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { ProjectRO } from '../routes/RequestObject';

export abstract class IProjectService extends IBaseService<any> {
  // getProject: (projetcId: number) => Promise<Result<Project>>;
  // getProjects: () => Promise<Result<Project[]>>;
  createProject: (payload: ProjectRO) => Promise<Result<number>>;
  updateProject: (payload: ProjectRO, projetcId: number) => Promise<Result<number>>;
}
