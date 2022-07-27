import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { ProjectMember, ProjectMemberStatus } from '@/modules/projects/models/ProjectMember';
import { ProjectMemberDao } from '@/modules/projects/daos/projectMemberDao';
import { IProjectMemberService } from '@/modules/projects/interfaces/IProjectMemberInterfaces';
import { ProjectMemberRo } from '@/modules/projects/routes/RequestObject';
import { log } from '@/decorators/log';
import { IProjectService } from '@/modules/projects/interfaces/IProjectInterfaces';
import { NotFoundError } from '@/Exceptions';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { Member } from '@/modules/hr/models/Member';
import { applyToAll } from '@/utils/utilities';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';

@provideSingleton(IProjectMemberService)
export class ProjectMemberService extends BaseService<ProjectMember> implements IProjectMemberService {
  constructor(
    public dao: ProjectMemberDao,
    public projectService: IProjectService,
    public memberService: IMemberService,
    public userService: IUserService,
    public organizationService: IOrganizationService,
  ) {
    super(dao);
  }

  static getInstance(): IProjectMemberService {
    return container.get(IProjectMemberService);
  }
  /**
   * add a list of members for a given project
   * a project can have one or many members
   * @param payload a list of members that will be associated to the project
   * @param id: project id we want to add members too
   * @returns
   */
  @log()
  public async createProjectMembers(payload: ProjectMemberRo[], id: number): Promise<ProjectMember[]> {
    const project = await this.projectService.get(id);
    if (!project) {
      throw new NotFoundError('PROJECT.NON_EXISTANT {{project}}', { variables: { project: `${id}` } });
    }
    let createdProjectMember: ProjectMember;
    const projectMembers: ProjectMember[] = [];

    await applyToAll(payload, async (projectMember) => {
      const user = await this.userService.get(projectMember.userId);

      if (!user) {
        throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${projectMember.userId}` } });
      }
      const organization = await this.organizationService.get(projectMember.orgId);

      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
          variables: { org: `${projectMember.orgId}` },
        });
      }

      let member: Member = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE, {
        populate: true,
      });

      if (!member) {
        throw new NotFoundError('MEMBER.NON_EXISTANT');
      }

      const wrappedProjectMember = this.wrapEntity(new ProjectMember(), {
        project,
        member,
        status: projectMember.status as ProjectMemberStatus,
        role: projectMember.role as ProjectMemberStatus,
      });
      createdProjectMember = await this.create(wrappedProjectMember);

      projectMembers.push(createdProjectMember);
    });

    return projectMembers;
  }
}
