import { Project } from './../models/Project';
import { ProjectTaskRO } from './../routes/RequestObject';
import { ProjectTask } from './../models/ProjetcTask';
import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';

export abstract class IProjectTaskService extends IBaseService<any> {
  getProjectTask: (projetcId: number) => Promise<Result<ProjectTask>>;
  getProjectTasks: () => Promise<Result<ProjectTask[]>>;
  createProjectTasks: (payloads: ProjectTaskRO[], project: Project) => Promise<Result<ProjectTask[]>>;
  updateProjectTask: (payload: ProjectTaskRO, projetcTaskId: number) => Promise<Result<number>>;
}
