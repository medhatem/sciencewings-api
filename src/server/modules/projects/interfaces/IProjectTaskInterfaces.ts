import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTask } from '@/modules/projects/models/ProjetcTask';
import { ProjectTaskRO } from '@/modules/projects/routes/RequestObject';
import { Result } from '@/utils/Result';

export abstract class IProjectTaskService extends IBaseService<any> {
  createProjectTasks: (payloads: ProjectTaskRO[], project: Project) => Promise<Result<ProjectTask[]>>;
}
