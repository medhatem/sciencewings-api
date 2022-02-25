import { container, provideSingleton } from '@/di/index';

import { BaseService } from './../../base/services/BaseService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IProjectTaskService } from '../interfaces/IProjectTaskInterfaces';
import { Project } from './../models/Project';
import { ProjectTask } from './../models/ProjetcTask';
import { ProjectTaskDao } from './../daos/projectTaskDAO';
import { ProjectTaskRO } from './../routes/RequestObject';
import { Result } from './../../../utils/Result';
import { applyToAll } from './../../../utils/utilities';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';

@provideSingleton(IProjectTaskService)
export class ProjectTaskService extends BaseService<ProjectTask> implements IProjectTaskService {
  constructor(public dao: ProjectTaskDao, public memberService: IMemberService) {
    super(dao);
  }
  getProjectTask: (projetcId: number) => Promise<Result<ProjectTask>>;
  getProjectTasks: () => Promise<Result<ProjectTask[]>>;

  static getInstance(): IProjectTaskService {
    return container.get(IProjectTaskService);
  }

  private async checkEntitiesExistance(entities: number[]): Promise<Result<any>> {
    let flagEntity = null;

    const members = await applyToAll(entities, async (entity) => {
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

  @log()
  @safeGuard()
  public async createProjectTasks(payloads: ProjectTaskRO[], project: Project): Promise<Result<ProjectTask[]>> {
    let flagError = null;

    const projectTasks = await applyToAll(payloads, async (payload) => {
      const assignedMembers = await this.checkEntitiesExistance(payload.assigned);
      if (assignedMembers.isFailure) {
        flagError = Result.fail(assignedMembers.error);
      }
      delete payload.assigned;
      const projectTask = await (
        await this.create({
          project,
          ...this.wrapEntity(new ProjectTask(), payload),
        })
      ).getValue();
      if (projectTask.isFailure) return null;
      projectTask.assigned = await assignedMembers.getValue();
      delete projectTask.project;
      return projectTask;
    });

    if (flagError) {
      return Result.fail('Assigned Member does not exist');
    }

    return Result.ok(projectTasks as any);
  }
}
