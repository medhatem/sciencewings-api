import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectTask } from '@/modules/projects/models/ProjectTask';
import { ProjectTaskDao } from '@/modules/projects/daos/projectTaskDAO';
import { ProjectTaskRO } from '@/modules/projects/routes/RequestObject';
import { log } from '@/decorators/log';

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
  public async createProjectTasks(payloads: ProjectTaskRO[], project: Project): Promise<ProjectTask[]> {
    const projectTasks = await Promise.all(
      payloads.map(async (payload) => {
        const assignedMembers = await this.memberService.getByCriteria(
          { organization: project.organization, user: payload.assigned },
          FETCH_STRATEGY.ALL,
          { refresh: true },
        );

        const createdProjectTask = await this.dao.create({
          ...this.wrapEntity(ProjectTask.getInstance(), payload),
          project,
        });

        createdProjectTask.assigned = await assignedMembers;
        return createdProjectTask;
      }),
    );

    return projectTasks as any;
  }
}
