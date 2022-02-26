import { IOrganizationService } from '@/modules/organizations/interfaces';
import { Project } from './../models/Project';
import { ProjectDao } from './../daos/projectDAO';
import { BaseService } from './../../base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { Result } from './../../../utils/Result';
import { ProjectRO } from '../routes/RequestObject';
import { CreateProjectSchema, UpdateProjectSchema } from '../schemas';
import { IProjectService } from '..';
import { IMemberService } from '@/modules/hr/interfaces';
import { IProjectTaskService } from '../interfaces/IProjectTaskInterfaces';
import { IProjectTagService } from '../interfaces/IProjectTagInterfaces';

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
  private async checkEntitiesExistance(entities: number[]): Promise<Result<any>> {
    let flagEntity = null;

    const members = entities.map(async (entity) => {
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
  @validate
  public async createProject(@validateParam(CreateProjectSchema) payload: ProjectRO): Promise<Result<number>> {
    const fetchedOrganization = await this.organizationService.get(payload.organization);

    if (fetchedOrganization.isFailure) {
      return Result.fail(`Organization with id ${payload.organization} does not exist.`);
    }

    const fetchedResponsibles = await this.checkEntitiesExistance(payload.responsibles);
    if (fetchedResponsibles.isFailure) {
      return Result.fail<number>(`Member with id ${fetchedResponsibles.error} does not exists`);
    }

    const fetchedParticipants = await this.checkEntitiesExistance(payload.participants);
    if (fetchedParticipants.isFailure) {
      return Result.fail<number>(`Member with id ${fetchedParticipants.error} does not exists`);
    }

    const organization = await fetchedOrganization.getValue();
    const responsibles = await fetchedResponsibles.getValue();
    const participants = await fetchedParticipants.getValue();

    const project: Project = {
      title: payload.title,
      description: payload.description,
      active: payload.active,
      date_start: payload.date_start,
      responsibles: responsibles,
      participants: participants,
      organizations: organization,
    };

    const createdProject = await this.create(project);
    if (createdProject.isFailure) {
      return Result.fail<number>(createdProject.error);
    }

    const createdProjectVal = await createdProject.getValue();

    if (payload.tasks && payload.tasks.length) {
      await this.projectTaskService.createProjectTasks(payload.tasks, createdProjectVal);
    }

    if (payload.tags && payload.tags.length) {
      await this.projectTagService.createProjectTags(payload.tags, createdProjectVal);
    }

    return Result.ok(createdProjectVal.id);
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
      return Result.fail<number>(`Project with id ${projetcId} does not exists`);
    }

    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (fetchedOrganization.isFailure) {
        return Result.fail(`Organization with id ${payload.organization} does not exist.`);
      }
      project.organizations = await fetchedOrganization.getValue();
    }

    if (payload.responsibles) {
      const fetchedResponsibles = await this.checkEntitiesExistance(payload.responsibles);
      // should be remove to avoid type conflic
      delete payload.responsibles;
      if (fetchedResponsibles.isFailure) {
        return Result.fail<number>(`Member with id ${fetchedResponsibles.error} does not exists`);
      }
      project.responsibles = await fetchedResponsibles.getValue();
    }

    if (payload.participants) {
      const fetchedParticipants = await this.checkEntitiesExistance(payload.participants);
      // should be remove to avoid type conflic
      delete payload.participants;
      if (fetchedParticipants.isFailure) {
        return Result.fail<number>(`Member with id ${fetchedParticipants.error} does not exists`);
      }
      project.participants = await fetchedParticipants.getValue();
    }

    const updatedProject = await this.update(
      this.wrapEntity(project, {
        ...project,
        ...payload,
      }),
    );
    if (updatedProject.isFailure) {
      return Result.fail<number>(updatedProject.error);
    }
    return Result.ok((await updatedProject.getValue()).id);
  }
}
