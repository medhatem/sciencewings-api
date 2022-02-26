import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTagRO } from '@/modules/projects/routes/RequestObject';
import { ProjectTask } from '@/modules/projects/models/ProjetcTask';
import { Result } from '@utils/Result';

export abstract class IProjectTagService extends IBaseService<any> {
  createProjectTags: (payload: ProjectTagRO[], project: Project) => Promise<Result<ProjectTask[]>>;
}
