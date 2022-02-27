import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IProjectTagService } from '@/modules/projects/interfaces/IProjectTagInterfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTag } from '@/modules/projects/models/ProjectTag';
import { ProjectTagDao } from '@/modules/projects/daos/projectTagDAO';
import { ProjectTagRO } from '@/modules/projects/routes/RequestObject';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { Result } from './../../../utils/Result';
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
   * create tags for the project
   * @param payload
   * @param project id
   * @returns
   */
  @log()
  @safeGuard()
  public async createProjectTags(payload: ProjectTagRO[], project: Project): Promise<Result<ProjectTask[]>> {
    const tasks: ProjectTask[] = [];
    const size = payload.length;
    for (let index = 0; index < size; index++) {
      const createdTaskResult = await this.create({
        project,
        ...this.wrapEntity(this.dao.model, payload[index]),
      });
      if (createdTaskResult.isFailure) {
        return Result.fail(createdTaskResult.error);
      }
      const createdTask = await createdTaskResult.getValue();
      // should be remove to avoid circular referencing
      delete createdTask.project;
      tasks.push(createdTask);
    }
    return Result.ok(tasks);
  }
}
