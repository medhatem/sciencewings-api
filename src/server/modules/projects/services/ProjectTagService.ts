import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IProjectTagService } from '@/modules/projects/interfaces/IProjectTagInterfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTag } from '@/modules/projects/models/ProjectTag';
import { ProjectTagDao } from '@/modules/projects/daos/projectTagDAO';
import { ProjectTagRO } from '@/modules/projects/routes/RequestObject';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { log } from '@/decorators/log';

@provideSingleton(IProjectTagService)
export class ProjectTagService extends BaseService<ProjectTag> implements IProjectTagService {
  constructor(public dao: ProjectTagDao) {
    super(dao);
  }

  static getInstance(): IProjectTagService {
    return container.get(IProjectTagService);
  }

  /**
   * add a list of tags for a given project
   * a project can have one or many tags
   * @param payload a list of tags that will be associated to the project
   * @param project id
   * @returns
   */
  @log()
  public async createProjectTags(payload: ProjectTagRO[], project: Project): Promise<ProjectTask[]> {
    const tasks: ProjectTask[] = [];
    for (const tag of payload) {
      const createdTaskResult = await this.create(
        this.wrapEntity(this.dao.model, {
          project,
          ...this.wrapEntity(this.dao.model, tag),
        }),
      );

      tasks.push(createdTaskResult as any);
    }
    return tasks;
  }
}
