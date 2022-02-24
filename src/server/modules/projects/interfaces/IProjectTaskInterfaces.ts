import { ProjectTaskRO } from './../routes/RequestObject';
import { ProjectTask } from './../models/ProjetcTask';
import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';

export abstract class IProjectTaskService extends IBaseService<any> {
  getProjectTask: (projetcId: number) => Promise<Result<ProjectTask>>;
  getProjectTasks: () => Promise<Result<ProjectTask[]>>;
  createProjectTasks: (payloads: ProjectTaskRO[]) => Promise<Result<ProjectTask[]>>;
  updateProjectTask: (payload: ProjectTaskRO, projetcTaskId: number) => Promise<Result<number>>;
}
