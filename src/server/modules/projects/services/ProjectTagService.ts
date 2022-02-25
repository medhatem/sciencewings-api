import { Project } from './../models/Project';
import { applyToAll } from '../../../utils/utilities';
import { ProjectTask } from './../models/ProjetcTask';
import { ProjectTagDao } from './../daos/projectTagDAO';
import { ProjectTagRO } from './../routes/RequestObject';
import { ProjectTag } from './../models/ProjetcTag';
import { BaseService } from './../../base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { Result } from './../../../utils/Result';
import { IProjectTagService } from '../interfaces/IProjectTagInterfaces';

@provideSingleton(IProjectTagService)
export class ProjectTagService extends BaseService<ProjectTag> implements IProjectTagService {
  constructor(public dao: ProjectTagDao) {
    super(dao);
  }
  getProjectTag: (projetcId: number) => Promise<Result<ProjectTag>>;
  getProjectTags: () => Promise<Result<ProjectTag[]>>;

  static getInstance(): IProjectTagService {
    return container.get(IProjectTagService);
  }

  @log()
  @safeGuard()
  public async createProjectTags(payload: ProjectTagRO[], project: Project): Promise<Result<ProjectTask[]>> {
    const tasks = await applyToAll(payload, async (task) => {
      const createdTask = await (
        await this.create({
          project,
          ...this.wrapEntity(new ProjectTag(), task),
        })
      ).getValue();
      delete createdTask.project;
      return createdTask;
    });
    return Result.ok(tasks);
  }

  @log()
  @safeGuard()
  public async updateProjectTag(payload: ProjectTagRO, projectId: number): Promise<Result<number>> {
    // ...

    // const updatedProjectTag = await this.update(_member);
    // if (updatedProjectTag.isFailure) {
    //   return Result.fail<number>(updatedProjectTag.error);
    // }
    // return Result.ok(updatedProjectTag.getValue().id);

    return Result.ok(0);
  }
}
