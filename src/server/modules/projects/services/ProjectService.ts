import { IOrganizationService } from '@/modules/organizations/interfaces';
import { Project } from '@/modules/projects/models/Project';
import { ProjectDao } from '@/modules/projects/daos/projectDAO';
import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { log } from '@/decorators/log';
import {
  listMembersRo,
  ProjectRO,
  UpdateProjectParticipantRO,
  UpdateProjectRO,
} from '@/modules/projects/routes/RequestObject';
import { CreateProjectSchema, UpdateProjectSchema } from '@/modules/projects/schemas/ProjectSchemas';
import { IMemberService } from '@/modules/hr/interfaces';
import { IProjectTaskService } from '@/modules/projects/interfaces/IProjectTaskInterfaces';
import { IProjectTagService } from '@/modules/projects/interfaces/IProjectTagInterfaces';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { NotFoundError, ValidationError } from '@/Exceptions';
import { IProjectMemberService } from '@/modules/projects/interfaces/IProjectMemberInterfaces';
import { RolesList, ProjectMemberStatus, ProjectMember } from '@/modules/projects/models/ProjectMember';
import { IUserService } from '@/modules/users';
import { applyToAll } from '@/utils/utilities';
import { Member } from '@/modules/hr/models/Member';
import { ConflictError } from '@/Exceptions/ConflictError';
import { ProjectList } from '@/types/types';

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
  public async getOrganizationProjects(id: number): Promise<Project[]> {
    const organization = await this.organizationService.getByCriteria({ id }, FETCH_STRATEGY.SINGLE);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${id}` } });
    }
    const fetchedProjects = (await this.dao.getByCriteria<FETCH_STRATEGY.ALL>({ organization }, FETCH_STRATEGY.ALL, {
      populate: ['members'] as never,
    })) as Project[];
    return fetchedProjects;
  }

  /**
   * create a new project in database
   * @userId id
   * @param payload the project payload
   */
  @log()
  public async createProject(userId: number, @validateParam(CreateProjectSchema) payload: ProjectRO): Promise<number> {
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
    const member = await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE, {
      populate: true,
    });

    const wrappedProject = this.wrapEntity(Project.getInstance(), {
      title: payload.title,
      key: payload.key,
      description: payload.description,
      active: payload.active,
      dateStart: payload.dateStart,
      dateEnd: payload.dateEnd,
    });
    wrappedProject.organization = organization;
    const project = await this.create(wrappedProject);
    const participant = this.projectMemberService.wrapEntity(ProjectMember.getInstance(), {
      role: RolesList.MANAGER,
      status: ProjectMemberStatus.ACTIVE,
    });
    participant.member = member;
    participant.project = project;
    await this.projectMemberService.create(participant);

    return project.id;
  }

  /**
   * update project
   * @param payload the project payload
   * @projetcId the if of project we want to update
   */
  @log()
  @validate
  public async updateProject(
    @validateParam(UpdateProjectSchema) payload: UpdateProjectRO,
    projetcId: number,
  ): Promise<number> {
    const project = await this.dao.get(projetcId);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${projetcId}` } });
    }
    //check if the project key is unique
    if (payload.key) {
      const ifProjectKeyIsUnique = await this.dao.getByCriteria({ key: payload.key });
      if (ifProjectKeyIsUnique) {
        throw new ConflictError('PROJECT.KEY_IS_NOT_UNIQUE {{key}}', { variables: { key: `${payload.key}` } });
      }
    }

    const updatedProjectResult = await this.update(
      this.wrapEntity(project, {
        ...project,
        title: payload.title || project.title,
        key: payload.key || project.key,
        description: payload.description || project.description,
        active: payload.active || project.active,
        dateStart: payload.dateStart || project.dateStart,
        dateEnd: payload.dateEnd || project.dateEnd,
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
  public async addMembersToProject(payload: listMembersRo, id: number): Promise<ProjectMember[]> {
    const project = await this.dao.get(id);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${id}` } });
    }

    const organization = await this.organizationService.get(payload.listMembers[0].orgId);

    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${payload.listMembers[0].orgId}` },
      });
    }

    // check if the organization really work on this project we want to add participant too.
    const isThisOrgWorkOnProject = await this.dao.getByCriteria({ organization });
    if (project !== isThisOrgWorkOnProject) {
      throw new NotFoundError('PROJECT.NOT_FOR_THIS_ORG {{project,org}}', {
        variables: { project: `${id}`, org: `${payload.listMembers[0].orgId}` },
      });
    }
    const projectMembers: ProjectMember[] = [];

    await applyToAll(payload.listMembers, async (projectMember) => {
      const user = await this.userService.get(projectMember.userId);

      if (!user) {
        throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${projectMember.userId}` } });
      }

      let member: Member = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE, {
        populate: true,
      });

      if (!member) {
        throw new NotFoundError('MEMBER.NON_EXISTANT');
      }

      const checkIfMemberAlreadyInProject: ProjectMember = await this.projectMemberService.getByCriteria(
        { member, project },
        FETCH_STRATEGY.SINGLE,
        {
          populate: true,
        },
      );
      if (checkIfMemberAlreadyInProject) {
        throw new ConflictError('PROJECT.MEMBER_IS_ALREADY_PARTICIPATE_IN_PROJECT {{member}}', {
          variables: { member: `${member.name}` },
        });
      }
      const wrappedProjectMember = this.projectMemberService.wrapEntity(ProjectMember.getInstance(), {
        status: projectMember.status as ProjectMemberStatus,
        role: projectMember.role as ProjectMemberStatus,
      });
      wrappedProjectMember.project = project;
      wrappedProjectMember.member = member;

      const createdProjectMember = await this.projectMemberService.create(wrappedProjectMember);

      projectMembers.push(createdProjectMember);
    });

    return projectMembers;
  }

  /**
   * Retrieve all project's participant
   * @param id project id
   * @returns
   */
  @log()
  public async getALLProjectParticipants(id: number): Promise<ProjectMember[]> {
    const project = await this.dao.get(id);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${id}` } });
    }
    const projectParticipants = await this.projectMemberService.getByCriteria({ project }, FETCH_STRATEGY.ALL, {
      refresh: true,
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
    let member: Member = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE, {
      populate: true,
    });

    if (!member) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }
    const fetchedProjectParticipants = await this.projectMemberService.getByCriteria(
      { project, member },
      FETCH_STRATEGY.SINGLE,
      {
        populate: true,
      },
    );

    const wrappedParticipant = this.wrapEntity(fetchedProjectParticipants, {
      ...fetchedProjectParticipants,
      role: payload.role || fetchedProjectParticipants.role,
      status: payload.status || fetchedProjectParticipants.role,
    });
    const updatedParticipant = await this.update(wrappedParticipant);
    return updatedParticipant;
  }
  /**
   * fetch project and project Member and return
   * name, starting date, number of participants from project table
   * Responsable of the project from the projectMember table
   * @param id project id
   * @returns
   */
  @log()
  public async getAllOrganizationProjectsList(id: number): Promise<ProjectList[]> {
    const organization = await this.organizationService.get(id);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${id}` } });
    }
    const fetchedProjects = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL)) as Project[];
    let projectList: any[] = [];
    let responsable;
    await applyToAll(fetchedProjects, async (project) => {
      responsable = await this.projectMemberService.getByCriteria({ project }, FETCH_STRATEGY.SINGLE, {
        populate: ['member'] as never,
        filters: { manager: true },
      });
      let membersLength = await project.members.loadCount(true);
      projectList.push({
        title: project.title,
        responsable: {
          member: responsable.member,
          name: responsable.member.name,
          email: responsable.member.workEmail,
        },
        members: membersLength,
        startDate: project.createdAt.toString(),
      });
    });
    return projectList;
  }
}
