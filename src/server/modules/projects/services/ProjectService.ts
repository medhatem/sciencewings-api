import { IOrganizationService } from '@/modules/organizations/interfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectDao } from '@/modules/projects/daos/projectDAO';
import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { log } from '@/decorators/log';
import { ProjectRO } from '@/modules/projects/routes/RequestObject';
import { CreateProjectSchema, UpdateProjectSchema } from '@/modules/projects/schemas/ProjectSchemas';
import { IMemberService } from '@/modules/hr/interfaces';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { IProjectTagService } from '@/modules/projects/interfaces/IProjectTagInterfaces';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { NotFoundError } from '@/Exceptions';

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
   * Retrieve organization projects
   *
   * @param id of organization
   */
  @log()
  public async getOrganizationProjects(id: number): Promise<Project[]> {
    const organization = await this.organizationService.getByCriteria({ id }, FETCH_STRATEGY.SINGLE);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${id}` } });
    }
    const fetchedProjects = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL)) as Project[];

    return fetchedProjects as Project[];
  }
  @log()
  @validate
  public async createProject(@validateParam(CreateProjectSchema) payload: ProjectRO): Promise<number> {
    const organization = await this.organizationService.get(payload.organization);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
    }

    const projectMember = await this.memberService.getByCriteria(
      { organization: payload.organization, user: payload.projectMember },
      FETCH_STRATEGY.ALL,
      { refresh: true },
    );

    const createdProject: Project = await this.dao.create({
      title: payload.title,
      description: payload.description,
      active: payload.active,
      dateStart: payload.dateStart,
      dateEnd: payload.dateEnd,
      projectMember,
      organization: organization,
    });

    return createdProject.id;
  }

  @log()
  @validate
  public async updateProject(
    @validateParam(UpdateProjectSchema) payload: ProjectRO,
    projetcId: number,
  ): Promise<number> {
    const project = await this.dao.get(projetcId);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${projetcId}` } });
    }

    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (!fetchedOrganization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
      }
      project.organization = await fetchedOrganization;
    }
    if (payload.projectMember) {
      const fetchedParticipants = await this.memberService.getByCriteria(
        { organization: payload.organization, user: payload.projectMember },
        FETCH_STRATEGY.ALL,
        { refresh: true },
      );

      project.projectMember = await fetchedParticipants;
    }

    const updatedProjectResult = await this.update(
      this.wrapEntity(project, {
        ...project,
        ...payload,
      }),
    );

    return (await updatedProjectResult).id;
  }
}
