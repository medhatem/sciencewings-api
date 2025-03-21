import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { Project, ProjectStatus } from '@/modules/projects/models/Project';
import { ProjectDao } from '@/modules/projects/daos/projectDAO';
import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { log } from '@/decorators/log';
import {
  ProjectMemberRo,
  ProjectRO,
  UpdateProjectParticipantRO,
  UpdateProjectRO,
} from '@/modules/projects/routes/RequestObject';
import { CreateProjectSchema } from '@/modules/projects/schemas/ProjectSchemas';
import { IMemberService } from '@/modules/hr/interfaces';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { IProjectTagService } from '@/modules/projects/interfaces/IProjectTagInterfaces';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { NotFoundError, ValidationError } from '@/Exceptions';
import { IProjectMemberService } from '@/modules/projects/interfaces/IProjectMemberInterfaces';
import { RolesList, ProjectMemberStatus, ProjectMember } from '@/modules/projects/models/ProjectMember';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { applyToAll, paginate } from '@/utils/utilities';
import { Member } from '@/modules/hr/models/Member';
import { ConflictError } from '@/Exceptions/ConflictError';
import { ProjectList, ProjectsPaginatedList } from '@/types/types';

@provideSingleton(IProjectService)
export class ProjectService extends BaseService<Project> implements IProjectService {
  constructor(
    public dao: ProjectDao,
    public userService: IUserService,
    public memberService: IMemberService,
    public organizationService: IOrganizationService,
    public projectTaskService: IProjectTaskService,
    public projectTagService: IProjectTagService,
    public projectMemberService: IProjectMemberService,
  ) {
    super(dao);
  }

  static getInstance(): IProjectService {
    return container.get(IProjectService);
  }

  /**
   * Retrieve all organization projects
   * @param id of organization
   */
  @log()
  public async getOrganizationProjects(id: number, page?: number, limit?: number): Promise<Project[]> {
    const organization = await this.organizationService.getByCriteria({ id }, FETCH_STRATEGY.SINGLE);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${id}` } });
    }
    let skip;
    if (page) {
      skip = (page - 1) * limit;
    }

    const fetchedProjects = (await this.dao.getByCriteria<FETCH_STRATEGY.ALL>({ organization }, FETCH_STRATEGY.ALL, {
      populate: ['members'] as never,
      refresh: true,
      offset: skip,
      limit: limit || 10,
    })) as Project[];
    fetchedProjects.map(async (project) => {
      await project.members.init();
    });
    return fetchedProjects;
  }
  /**
   * Retrieve a project
   * @param id of project
   */
  @log()
  public async getOrganizationProjectById(id: number): Promise<Project> {
    const project = (await this.dao.getByCriteria({ id }, FETCH_STRATEGY.SINGLE, {
      populate: ['members'] as never,
    })) as Project;
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${id}` } });
    }
    return project;
  }

  /**
   * create a new project in database
   * @userId id
   * @param payload the project payload
   */
  @log()
  public async createProject(userId: number, @validateParam(CreateProjectSchema) payload: ProjectRO): Promise<number> {
    const forkedEntityManager = await this.dao.fork();
    await forkedEntityManager.begin();
    let project: Project;
    try {
      //check if the project key is unique
      const ifProjectKeyIsUnique = await this.dao.getByCriteria({ key: payload.key });
      if (ifProjectKeyIsUnique) {
        throw new ValidationError('PROJECT.KEY_IS_NOT_UNIQUE {{key}}', {
          variables: { key: `${payload.key}` },
          friendly: true,
        });
      }
      const organization = await this.organizationService.get(payload.organization);
      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${payload.organization}` } });
      }
      const user = await this.userService.get(userId);
      if (!user) {
        throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` } });
      }
      // add the user who create the project as a manager of project
      const member = await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE);
      if (!member) {
        throw new NotFoundError('MEMBER.NON_EXISTANT');
      }
      const wrappedProject = this.wrapEntity(Project.getInstance(), {
        title: payload.title,
        key: payload.key,
        description: payload.description,
        status: ProjectStatus.TODO,
      });
      wrappedProject.organization = organization.id;
      project = await this.dao.transactionalCreate(wrappedProject);
      const participant = this.projectMemberService.wrapEntity(ProjectMember.getInstance(), {
        role: RolesList.MANAGER,
        status: ProjectMemberStatus.ACTIVE,
      });
      const createdProject = (await this.dao.getByCriteria({ key: payload.key }, FETCH_STRATEGY.SINGLE)) as Project;
      participant.member = member;
      participant.project = createdProject.id;
      await this.projectMemberService.transactionalCreate(participant);

      await forkedEntityManager.commit();
    } catch (error) {
      await forkedEntityManager.rollback();
      throw error;
    }
    await this.dao.entitymanager.flush();
    return project.id;
  }

  /**
   * update project
   * @param payload the project payload
   * @projetcId the if of project we want to update
   */
  @log()
  public async updateProject(payload: UpdateProjectRO, projetcId: number): Promise<number> {
    const project = await this.dao.get(projetcId);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${projetcId}` } });
    }
    // check if the project key is unique
    if (payload.key && project.key !== payload.key) {
      const ifProjectKeyIsUnique = await this.dao.getByCriteria({ key: payload.key });
      if (ifProjectKeyIsUnique) {
        throw new ConflictError('PROJECT.KEY_IS_NOT_UNIQUE {{key}}', { variables: { key: `${payload.key}` } });
      }
    }
    if (payload.newManager) {
      const oldManager = await this.projectMemberService.getByCriteria({ project }, FETCH_STRATEGY.SINGLE, {
        filters: { manager: true },
      });

      if (oldManager.id == payload.newManager) {
        const newManager = await this.projectMemberService.get(payload.newManager);

        // Role changing
        await this.projectMemberService.update(
          this.projectMemberService.wrapEntity(oldManager, {
            ...oldManager,
            role: RolesList.PARTICIPANT,
          }),
        );
        await this.projectMemberService.update(
          this.wrapEntity(newManager, {
            ...oldManager,
            role: RolesList.MANAGER,
          }),
        );
      }
    }
    const updatedProjectResult = await this.update(
      this.wrapEntity(project, {
        ...project,
        ...payload,
      }),
    );

    return updatedProjectResult.id;
  }

  /**
   * add a list of members for a given project
   * a project can have one or many members
   * @param payload a list of members that will be added to the project
   * @param id the id of the project we want to add members too
   */
  @log()
  public async addMembersToProject(payload: ProjectMemberRo, id: number): Promise<ProjectMember[]> {
    const project = await this.dao.get(id);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${id}` } });
    }

    const organization = await this.organizationService.get(payload.orgId);

    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${payload.orgId}` },
      });
    }

    const projectMembers: ProjectMember[] = [];

    const user = await this.userService.get(payload.userId);

    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', {
        variables: { user: `${payload.userId}` },
        friendly: true,
      });
    }

    const member: Member = await this.memberService.getByCriteria(
      { user: user.id, organization: organization.id },
      FETCH_STRATEGY.SINGLE,
    );

    if (!member) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }
    const checkIfMemberAlreadyInProject: ProjectMember = await this.projectMemberService.getByCriteria(
      { member, project: project.id },
      FETCH_STRATEGY.SINGLE,
    );

    if (checkIfMemberAlreadyInProject) {
      throw new ConflictError('PROJECT.MEMBER_IS_ALREADY_PARTICIPATE_IN_PROJECT {{member}}', {
        variables: { member: `${member.name}` },
      });
    }

    const wrappedProjectMember = this.projectMemberService.wrapEntity(ProjectMember.getInstance(), {
      status: payload.status,
      role: payload.role as ProjectMemberStatus,
    });
    wrappedProjectMember.project = project.id;
    wrappedProjectMember.member = member;
    const createdProjectMember = await this.projectMemberService.create(wrappedProjectMember);

    projectMembers.push(createdProjectMember);

    return projectMembers;
  }

  /**
   * Retrieve all project's participant
   * @param id project id
   * @returns
   */
  @log()
  public async getALLProjectParticipants(id: number, page?: number, limit?: number): Promise<ProjectMember[]> {
    const project = await this.dao.get(id);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${id}` } });
    }

    let skip;
    if (page) {
      skip = (page - 1) * limit;
    }
    const projectParticipants = await this.projectMemberService.getByCriteria({ project }, FETCH_STRATEGY.ALL, {
      refresh: true,
      offset: skip,
      limit: limit || 10,
    });
    return projectParticipants;
  }

  /**
   * update Role and status of project participant
   * @param projectId
   * @param payload
   * @returns
   */
  @log()
  public async updateProjectParticipant(
    projectId: number,
    payload: UpdateProjectParticipantRO,
  ): Promise<ProjectMember> {
    const project = await this.dao.get(projectId);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${projectId}` } });
    }
    const user = await this.userService.get(payload.userId);

    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${payload.userId}` } });
    }
    const organization = await this.organizationService.get(payload.orgId);

    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${payload.orgId}` },
      });
    }
    const member: Member = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE, {});

    if (!member) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }
    const fetchedProjectParticipants = await this.projectMemberService.getByCriteria(
      { project, member },
      FETCH_STRATEGY.SINGLE,
    );

    const wrappedParticipant = this.wrapEntity(fetchedProjectParticipants, {
      ...fetchedProjectParticipants,
      role: payload.role || fetchedProjectParticipants.role,
      status: payload.status || fetchedProjectParticipants.role,
    });
    const updatedParticipant = await this.update(wrappedParticipant);
    return updatedParticipant;
  }

  @log()
  public async prepareProjectsList(fetchedProjects: Project[]): Promise<ProjectList[]> {
    const projectList: any[] = [];
    let responsable;
    await applyToAll(fetchedProjects, async (project) => {
      responsable = await this.projectMemberService.getByCriteria({ project }, FETCH_STRATEGY.SINGLE, {
        populate: ['member'] as never,
        filters: { manager: true },
      });
      const membersLength = await project.members.loadCount(true);
      projectList.push({
        title: project.title,
        responsable: {
          member: responsable.member,
          name: responsable.member.name,
          email: responsable.member.workEmail,
        },
        members: membersLength,
        creatingDate: project.createdAt.toString(),
        id: project.id,
        projectDto: project,
      });
    });
    return projectList;
  }

  /**
   * fetch project and project Member and return
   * name, starting date, number of participants from project table
   * Responsable of the project from the projectMember table
   * @param id org id
   * @returns
   */
  @log()
  public async getAllOrganizationProjectsList(
    id: number,
    page?: number,
    size?: number,
    query?: string,
  ): Promise<ProjectsPaginatedList> {
    const organization = await this.organizationService.get(id);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${id}` } });
    }

    const length = await this.dao.count({ organization });

    let projects;

    if (page | size) {
      const skip = page * size;
      if (query) {
        projects = (await this.dao.getByCriteria(
          { organization, title: { $like: '%' + query + '%' } },
          FETCH_STRATEGY.ALL,
          {
            offset: skip,
            limit: size,
          },
        )) as Project[];
      } else {
        projects = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL, {
          offset: skip,
          limit: size,
        })) as Project[];
      }

      const result = paginate(projects, page, size, skip, length);

      const paginatedDataList = await this.prepareProjectsList(result.data);

      const paginatedResult: ProjectsPaginatedList = {
        data: paginatedDataList,
        pagination: result.pagination,
      };
      return paginatedResult;
    }

    projects = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL)) as Project[];

    projects = this.prepareProjectsList(projects);
    const result: ProjectsPaginatedList = {
      data: projects,
    };
    return result;
  }
}
