import { Member } from '@/modules/hr/models/Member';
import { IOrganizationService } from '@/modules/organizations/interfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectDao } from '@/modules/projects/daos/projectDAO';
import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { Result } from '@/utils/Result';
import { ProjectRO } from '@/modules/projects/routes/RequestObject';
import { CreateProjectSchema, UpdateProjectSchema } from '../schemas';
import { IMemberService } from '@/modules/hr/interfaces';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { IProjectTagService } from '@/modules/projects/interfaces/IProjectTagInterfaces';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';
@provideSingleton(IProjectService)
export class ProjectService extends BaseService<Project> implements IProjectService {
  constructor(
    public dao: ProjectDao,
    public memberService: IMemberService,
    public organizationService: IOrganizationService,
    public projectTaskService: IProjectTaskService,
    public projectTagService: IProjectTagService,
  ) {
    super(dao);
  }

  static getInstance(): IProjectService {
    return container.get(IProjectService);
  }

  /**
   * check if the members does exist
   * given an array of member ids
   * @param entities
   * @returns
   */
  @log()
  @safeGuard()
  private async checkEntitiesExistance(entities: number[]): Promise<Result<any>> {
    const members: Member[] = [];

    const size = entities.length;
    for (let index = 0; index < size; index++) {
      const getMember = await this.memberService.get(entities[index]);
      const getMemberValue = getMember.getValue();
      if (!getMemberValue) {
        return Result.fail(`Member with id ${entities[index]} does not exist`);
      }
      members.push(getMemberValue);
    }

    return Result.ok(members);
  }

  @log()
  @safeGuard()
  @validate
  public async createProject(@validateParam(CreateProjectSchema) payload: ProjectRO): Promise<Result<number>> {
    const fetchedOrganization = await this.organizationService.get(payload.organization);

    if (fetchedOrganization.isFailure) {
      return Result.fail(`Organization with id ${payload.organization} does not exist.`);
    }

    const fetchedResponsibles = await this.checkEntitiesExistance(payload.managers);
    if (fetchedResponsibles.isFailure) {
      return Result.fail<number>(`Member with id ${fetchedResponsibles.error} does not exist`);
    }

    const fetchedParticipants = await this.checkEntitiesExistance(payload.participants);
    if (fetchedParticipants.isFailure) {
      return Result.fail<number>(`Member with id ${fetchedParticipants.error} does not exist`);
    }

    const organization = await fetchedOrganization.getValue();
    const managers = await fetchedResponsibles.getValue();
    const participants = await fetchedParticipants.getValue();

    const project: Project = {
      title: payload.title,
      description: payload.description,
      active: payload.active,
      dateStart: payload.dateStart,
      managers: managers,
      participants: participants,
      organizations: organization,
    };

    const createdProjectResult = await this.create(project);
    if (createdProjectResult.isFailure) {
      return Result.fail<number>(createdProjectResult.error);
    }

    const createdProject = await createdProjectResult.getValue();

    if (payload.tasks && payload.tasks.length) {
      await this.projectTaskService.createProjectTasks(payload.tasks, createdProject);
    }

    if (payload.tags && payload.tags.length) {
      await this.projectTagService.createProjectTags(payload.tags, createdProject);
    }

    return Result.ok(createdProject.id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateProject(
    @validateParam(UpdateProjectSchema) payload: ProjectRO,
    projetcId: number,
  ): Promise<Result<number>> {
    const project = await this.dao.get(projetcId);
    if (!project) {
      return Result.fail<number>(`Project with id ${projetcId} does not exist`);
    }

    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (fetchedOrganization.isFailure) {
        return Result.fail(`Organization with id ${payload.organization} does not exist.`);
      }
      project.organizations = await fetchedOrganization.getValue();
    }

    if (payload.managers) {
      const fetchedResponsibles = await this.checkEntitiesExistance(payload.managers);
      // should be remove to avoid type conflic
      delete payload.managers;
      if (fetchedResponsibles.isFailure) {
        return Result.fail<number>(`Member with id ${fetchedResponsibles.error} does not exist`);
      }
      project.managers = await fetchedResponsibles.getValue();
    }

    if (payload.participants) {
      const fetchedParticipants = await this.checkEntitiesExistance(payload.participants);
      // should be remove to avoid type conflic
      delete payload.participants;
      if (fetchedParticipants.isFailure) {
        return Result.fail<number>(`Member with id ${fetchedParticipants.error} does not exist`);
      }
      project.participants = await fetchedParticipants.getValue();
    }

    const updatedProjectResult = await this.update(
      this.wrapEntity(project, {
        ...project,
        ...payload,
      }),
    );
    if (updatedProjectResult.isFailure) {
      return Result.fail<number>(updatedProjectResult.error);
    }
    return Result.ok((await updatedProjectResult.getValue()).id);
  }
}
