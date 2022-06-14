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
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
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

  @log()
  @safeGuard()
  @validate
  public async createProject(@validateParam(CreateProjectSchema) payload: ProjectRO): Promise<Result<number>> {
    const fetchedOrganization = await this.organizationService.get(payload.organization);
    if (fetchedOrganization.isFailure) {
      return Result.fail(`Organization with id ${payload.organization} does not exist.`);
    }
    const fetchedResponsibles = await this.memberService.getByCriteria(
      { organization: payload.organization, user: payload.managers },
      FETCH_STRATEGY.ALL,
      { refresh: true },
    );
    if (fetchedResponsibles.isFailure) {
      return fetchedResponsibles;
    }
    const fetchedParticipants = await this.memberService.getByCriteria(
      { organization: payload.organization, user: payload.participants },
      FETCH_STRATEGY.ALL,
      { refresh: true },
    );
    if (fetchedParticipants.isFailure) {
      return fetchedParticipants;
    }

    const organization = await fetchedOrganization.getValue();
    const managers = await fetchedResponsibles.getValue();
    const participants = await fetchedParticipants.getValue();

    const createdProject: Project = await this.dao.create({
      title: payload.title,
      description: payload.description,
      active: payload.active,
      dateStart: payload.dateStart,
      managers: managers,
      participants: participants,
      organizations: organization,
    });
    if (!createdProject) {
      return Result.fail(`fail to create project.`);
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
      const fetchedResponsibles = await this.memberService.getByCriteria(
        { organization: payload.organization, user: payload.managers },
        FETCH_STRATEGY.ALL,
        { refresh: true },
      );
      if (fetchedResponsibles.isFailure) {
        return fetchedResponsibles;
      }
      project.managers = await fetchedResponsibles.getValue();
    }

    if (payload.participants) {
      const fetchedParticipants = await this.memberService.getByCriteria(
        { organization: payload.organization, user: payload.participants },
        FETCH_STRATEGY.ALL,
        { refresh: true },
      );
      if (fetchedParticipants.isFailure) {
        return fetchedParticipants;
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
      return Result.fail<number>(`Project with id ${projetcId} can not be updated`);
    }
    return Result.ok((await updatedProjectResult.getValue()).id);
  }
}
