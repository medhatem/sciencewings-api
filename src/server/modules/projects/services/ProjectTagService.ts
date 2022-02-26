import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IProjectTagService } from '@/modules/projects/interfaces/IProjectTagInterfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTag } from '@/modules/projects/models/ProjetcTag';
import { ProjectTagDao } from '@/modules/projects/daos/projectTagDAO';
import { ProjectTagRO } from '@/modules/projects/routes/RequestObject';
import { ProjectTask } from '@/modules/projects/models/ProjetcTask';
import { Result } from './../../../utils/Result';
import { applyToAll } from '../../../utils/utilities';
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
    const tasks = await applyToAll(payload, async (task) => {
      const createdTask = await this.create({
        project,
        ...this.wrapEntity(this.dao.model, task),
      });
      if (createdTask.isFailure) {
        return Result.fail(createdTask.error);
      }
      const resTask = await createdTask.getValue();
      // should be remove to avoid circular referencing
      delete resTask.project;
      return resTask;
    });
    return Result.ok(tasks);
  }
}
