import { applyToAll } from './../../../utils/utilities';
import { ProjectTask } from './../models/ProjetcTask';
import { ProjectTaskDao } from './../daos/projectTaskDAO';
import { ProjectTaskRO } from './../routes/RequestObject';
import { BaseService } from './../../base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { Result } from './../../../utils/Result';
import { ProjectTaskSchema } from '../schemas';
import { IProjectTaskService } from '../interfaces/IProjectTaskInterfaces';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';

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
  public async createProjectTasks(payloads: ProjectTaskRO[]): Promise<Result<ProjectTask[]>> {
    let flagError = null;

    const projectTasks = await applyToAll(payloads, async (payload, idx) => {
      const assignedMembers = await this.checkEntitiesExistance(payload.assigned);
      if (assignedMembers.isFailure) {
        flagError = Result.fail(assignedMembers.error);
      }
      delete payload.assigned;
      const projectTask = await this.create(this.wrapEntity(new ProjectTask(), payload));
      if (projectTask.isFailure) return null;
      (await projectTask.getValue()).assigned = await assignedMembers.getValue();
      return projectTask;
    });

    if (flagError) {
      return Result.fail('Assigned Member does not exist');
    }

    return Result.ok(projectTasks as any);
  }

  @log()
  @safeGuard()
  public async updateProjectTask(payload: ProjectTaskRO, projectTaskrId: number): Promise<Result<number>> {
    return;
  }
}
