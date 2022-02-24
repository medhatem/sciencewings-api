// import { ProjectTag } from './../models/ProjetcTag';
// import { Member } from '@/modules/hr/models/Member';
import { IOrganizationService } from '@/modules/organizations/interfaces';
import { applyToAll } from '../../../utils/utilities';
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
  @validate
  public async createProject(@validateParam(CreateProjectSchema) payload: ProjectRO): Promise<Result<number>> {
    const testOrganization = await this.organizationService.get(payload.organization);

    if (testOrganization.isFailure) {
      return Result.fail(`Organization with id ${payload.organization} does not exist.`);
    }

    const testResponsibles = await this.checkEntitiesExistance(payload.responsibles);

    delete payload.responsibles;
    if (testResponsibles.isFailure) {
      return Result.fail<number>(`Member with id ${testResponsibles.error} does not exists`);
    }

    const testParticipants = await this.checkEntitiesExistance(payload.participants);
    delete payload.participants;
    if (testParticipants.isFailure) {
      return Result.fail<number>(`Member with id ${testParticipants.error} does not exists`);
    }

    const organization = await testOrganization.getValue();
    const responsibles = await testResponsibles.getValue();
    const participants = await testParticipants.getValue();

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

    if (payload.tasks.length) {
      await this.projectTaskService.createProjectTasks(payload.tasks, createdProjectVal);
    }

    if (payload.tags.length) {
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
    // ...

    // const updatedProject = await this.update(_member);
    // if (updatedProject.isFailure) {
    //   return Result.fail<number>(updatedProject.error);
    // }
    // return Result.ok(updatedProject.getValue().id);
    return Result.ok(0);
  }

  // @log()
  // @safeGuard()
  // async getProject(projetcId: number): Promise<Result<Project>> {
  //   try {
  //     const project = await this.dao.get(projetcId);

  //     if (project === null) {
  //       return Result.fail(`project with id ${projetcId} does not exits`);
  //     }
  //     project.responsibles = (await project.responsibles.init()).toArray() as any;
  //     project.participants = (await project.participants.init()).toArray() as any;

  //     project.projectTags = (await project.projectTags.init()).toArray() as any;
  //     project.projectTags = (await applyToAll(project.projectTags as any, async (entity: ProjectTag) => {
  //       delete entity.project;
  //       return entity;
  //     })) as any;

  //     project.projectTasks = (await project.projectTasks.init()).toArray() as any;
  //     project.projectTasks = (await applyToAll(project.projectTasks as any, async (entity: ProjectTag) => {
  //       delete entity.project;
  //       return entity;
  //     })) as any;

  //     return Result.ok(project);
  //   } catch (error) {
  //     return Result.fail(error);
  //   }
  // }

  // @log()
  // @safeGuard()
  // @validate
  // async getProjects(): Promise<Result<Project[]>> {
  //   try {
  //     const projects = await this.dao.getAll();
  //     return Result.ok(projects);
  //   } catch (error) {
  //     return Result.fail(error);
  //   }
  // }
}
