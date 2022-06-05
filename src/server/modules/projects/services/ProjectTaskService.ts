import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { ProjectTaskDao } from '@/modules/projects/daos/projectTaskDAO';
import { ProjectTaskRO } from '@/modules/projects/routes/RequestObject';
import { Result } from '@/utils/Result';
import { checkMemberExistance } from './ProjectServiceUtils';
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

  /**
   * add a list of tasks for a given project
   * a project can have one or many tasks
   * @param payloads a list of project tasks to be created
   * @param project
   * @returns
   */
  @log()
  @safeGuard()
  public async createProjectTasks(payloads: ProjectTaskRO[], project: Project): Promise<Result<ProjectTask[]>> {
    const projectTasks = await Promise.all(
      payloads.map(async (payload) => {
        const assignedMembers = await checkMemberExistance(payload.assigned, this.memberService);
        if (assignedMembers.isFailure) {
          return assignedMembers;
        }
        const createdProjectTaskReslt = await this.create({
          project,
          ...this.wrapEntity(this.dao.model, payload),
        });
        if (createdProjectTaskReslt.isFailure) {
          return null;
        }
        const createdProjectTask = await createdProjectTaskReslt.getValue();
        createdProjectTask.assigned = await assignedMembers.getValue();
        return createdProjectTask;
      }),
    );

    return Result.ok(projectTasks as any);
  }
}
