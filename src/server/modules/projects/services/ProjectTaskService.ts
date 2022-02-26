import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTask } from '@/modules/projects/models/ProjetcTask';
import { ProjectTaskDao } from '@/modules/projects/daos/projectTaskDAO';
import { ProjectTaskRO } from '@/modules/projects/routes/RequestObject';
import { Result } from './../../../utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';

@provideSingleton(IProjectTaskService)
export class ProjectTaskService extends BaseService<ProjectTask> implements IProjectTaskService {
  constructor(public dao: ProjectTaskDao, public memberService: IMemberService) {
    super(dao);
  }

  static getInstance(): IProjectTaskService {
    return container.get(IProjectTaskService);
  }

  @log()
  @safeGuard()
  private async checkEntitiesExistance(entities: number[]): Promise<Result<any>> {
    let flagEntity = null;

    const members = await entities.map(async (entity) => {
      const getMember = await this.memberService.get(entity);
      const getMemberValue = getMember.getValue();
      if (getMemberValue === null) {
        flagEntity = entity;
        return null;
      }
      return getMemberValue;
    });

    if (flagEntity) {
      return Result.fail(flagEntity);
    } else {
      return Result.ok(members);
    }
  }

  /**
   * create tasks for the project
   * @param payloads
   * @param project
   * @returns
   */
  @log()
  @safeGuard()
  public async createProjectTasks(payloads: ProjectTaskRO[], project: Project): Promise<Result<ProjectTask[]>> {
    let flagError = null;

    const projectTasks = await payloads.map(async (payload) => {
      const assignedMembers = await this.checkEntitiesExistance(payload.assigned);
      if (assignedMembers.isFailure) {
        flagError = Result.fail(assignedMembers.error);
      }
      // should be remove to avoid circular referencing
      delete payload.assigned;
      const createdProjectTask = await this.create({
        project,
        ...this.wrapEntity(this.dao.model, payload),
      });
      if (createdProjectTask.isFailure) {
        return null;
      }
      const projectTask = await createdProjectTask.getValue();
      projectTask.assigned = await assignedMembers.getValue();
      // should be remove to avoid circular referencing
      delete projectTask.project;
      return projectTask;
    });

    if (flagError) {
      return Result.fail('Assigned Member does not exist');
    }

    return Result.ok(projectTasks as any);
  }
}
