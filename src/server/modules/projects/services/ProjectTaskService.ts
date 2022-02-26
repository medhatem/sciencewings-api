import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { Member } from '@/modules/hr/models/Member';
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
    const members: Member[] = [];

    const size = entities.length;
    for (let index = 0; index < size; index++) {
      const getMember = await this.memberService.get(entities[index]);
      const getMemberValue = getMember.getValue();
      if (getMemberValue === null) {
        return Result.fail(`Member with id ${entities[index]} does not exist`);
      }
      members.push(getMemberValue);
    }

    return Result.ok(members);
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
    const projectTasks = await payloads.map(async (payload) => {
      const assignedMembers = await this.checkEntitiesExistance(payload.assigned);
      if (assignedMembers.isFailure) {
        return Result.fail(assignedMembers.error);
      }
      // should be remove to avoid circular referencing
      delete payload.assigned;
      const createdProjectTaskReslt = await this.create({
        project,
        ...this.wrapEntity(this.dao.model, payload),
      });
      if (createdProjectTaskReslt.isFailure) {
        return null;
      }
      const createdProjectTask = await createdProjectTaskReslt.getValue();
      createdProjectTask.assigned = await assignedMembers.getValue();
      // should be remove to avoid circular referencing
      delete createdProjectTask.project;
      return createdProjectTask;
    });

    return Result.ok(projectTasks as any);
  }
}
