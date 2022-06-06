import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { ProjectTaskDao } from '@/modules/projects/daos/projectTaskDAO';
import { ProjectTaskRO } from '@/modules/projects/routes/RequestObject';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';

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
        const assignedMembers = await this.memberService.getByCriteria(
          { organization: project.organizations, user: payload.assigned },
          FETCH_STRATEGY.ALL,
          { refresh: true },
        );
        if (assignedMembers.isFailure) {
          return assignedMembers;
        }
        const createdProjectTask = await this.dao.create({
          ...this.wrapEntity(this.dao.model, payload),
          project,
        });
        if (!createdProjectTask) {
          return Result.fail(`fail to create project.`);
        }
        createdProjectTask.assigned = await assignedMembers.getValue();
        return createdProjectTask;
      }),
    );

    return Result.ok(projectTasks as any);
  }
}
