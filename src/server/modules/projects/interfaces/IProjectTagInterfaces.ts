import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTagRO } from '@/modules/projects/routes/RequestObject';
import { ProjectTag } from '@/modules/projects/models/ProjectTag';

export abstract class IProjectTagService extends IBaseService<any> {
  createProjectTags: (payload: ProjectTagRO[], project: Project) => Promise<ProjectTag[]>;
}
