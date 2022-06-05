import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IProjectTagService } from '@/modules/projects/interfaces/IProjectTagInterfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTag } from '@/modules/projects/models/ProjectTag';
import { ProjectTagDao } from '@/modules/projects/daos/projectTagDAO';
import { ProjectTagRO } from '@/modules/projects/routes/RequestObject';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';

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
  @safeGuard()
  public async createProjectTags(payload: ProjectTagRO[], project: Project): Promise<Result<ProjectTask[]>> {
    const tasks: ProjectTask[] = [];
    for (const tag of payload) {
      const createdTaskResult = await this.create(
        this.wrapEntity(this.dao.model, {
          project,
          ...this.wrapEntity(this.dao.model, tag),
        }),
      );
      if (createdTaskResult.isFailure) {
        return Result.fail(`Can not create project task`);
      }
      const createdTask = await createdTaskResult.getValue();

      tasks.push(createdTask);
    }
    return Result.ok(tasks);
  }
}
