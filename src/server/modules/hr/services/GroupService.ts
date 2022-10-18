import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Group } from '@/modules/hr/models/Group';
import { GroupDAO } from '@/modules/hr/daos/GroupDAO';
import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { log } from '@/decorators/log';
import { GroupRO } from '@/modules/hr/routes/RequestObject';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { CreateGroupSchema, UpdateGroupSchema } from '@/modules/hr/schemas/GroupSchema';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { applyToAll, paginate } from '@/utils/utilities';
import { grpPrifix } from '@/modules/prifixConstants';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { Member } from '../models/Member';
import { IUserService } from '@/modules/users/interfaces/IUserService';

@provideSingleton(IGroupService)
export class GroupService extends BaseService<Group> implements IGroupService {
  constructor(
    public dao: GroupDAO,
    public organizationService: IOrganizationService,
    public userService: IUserService,
    public memberService: IMemberService,
    public keycloakUtils: KeycloakUtil,
  ) {
    super(dao);
  }

  static getInstance(): IGroupService {
    return container.get(IGroupService);
  }

  @log()
  public async getOrganizationGroup(organizationId: number, page?: number, size?: number): Promise<any> {
    let groups = (await this.dao.getByCriteria({ organization: organizationId }, FETCH_STRATEGY.ALL)) as Group[];

    groups.map(async (group) => await group.members.init());

    if (page | size) {
      const paginatedGroupsList = paginate(groups, page, size);
      return paginatedGroupsList;
    }

    return groups;
  }

  @log()
  public async getGroupMembers(groupId: number): Promise<any> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${groupId}` } });
    }
    await fetchedGroup.members.init();
    return fetchedGroup.members;
  }

  @log()
  @validate
  public async createGroup(@validateParam(CreateGroupSchema) payload: GroupRO): Promise<number> {
    const organization = await this.organizationService.get(payload.organization);

    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_{{org}}', {
        variables: { org: `${payload.organization}` },
        isOperational: true,
      });
    }
    const wrappedGroup = this.wrapEntity(Group.getInstance(), {
      name: payload.name,
      active: payload.active,
      description: payload.description,
    });

    if (payload.parent) {
      const fetchedGroup = await this.dao.get(payload.parent);
      if (!fetchedGroup) {
        throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${payload.parent}` } });
      }
      wrappedGroup.parent = fetchedGroup;
    }

    wrappedGroup.organization = organization;

    const id = await this.keycloakUtils.createSubGroup(`${grpPrifix}${payload.name}`, organization.kcid);

    wrappedGroup.kcid = id;
    const createdGroup = await this.dao.create(wrappedGroup);
    if (payload.members) {
      await createdGroup.members.init();
      await applyToAll(payload.members, async (userId) => {
        // fetch the user with the memberUserId
        const user = await this.userService.get(userId);
        if (!user) {
          throw new NotFoundError('USER.NON_EXISTANT_DATA {{user}}', {
            variables: { user: `${userId}` },
            friendly: false,
          });
        }
        // fetch the member with both of the user and org
        const fetchedMember = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);

        if (fetchedMember !== null) {
          createdGroup.members.add(fetchedMember);
          await this.keycloakUtils.addMemberToGroup(wrappedGroup.kcid, fetchedMember.user.keycloakId);
          await this.dao.update(createdGroup);
        }
        return fetchedMember;
      });
    }

    return createdGroup.id;
  }

  @log()
  @validate
  public async updateGroup(@validateParam(UpdateGroupSchema) payload: GroupRO, groupId: number): Promise<number> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${groupId}` } });
    }

    if (fetchedGroup.name !== payload.name) {
      await this.keycloakUtils.updateGroup(fetchedGroup.kcid, { name: `${grpPrifix}${payload.name}` });
    }

    const wrappedGroup = this.wrapEntity(fetchedGroup, {
      ...fetchedGroup,
      ...payload,
    });
    await this.dao.update(wrappedGroup);

    return fetchedGroup.id;
  }

  @log()
  public async deleteGroup(groupId: number): Promise<number> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${groupId}` } });
    }
    await this.keycloakUtils.deleteGroup(fetchedGroup.kcid);
    await this.dao.remove(fetchedGroup);

    return groupId;
  }

  @log()
  public async addGroupMember(userId: number, groupId: number): Promise<number> {
    const fetchedGroup = (await this.dao.get(groupId)) as Group;
    if (!fetchedGroup) {
      throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${groupId}` } });
    }
    const organization = await this.organizationService.get(fetchedGroup.organization.id);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${fetchedGroup.organization.id}` },
        friendly: false,
      });
    }

    const user = await this.userService.get(userId);
    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` } });
    }

    const fetchedMember = (await this.memberService.getByCriteria(
      { user, organization },
      FETCH_STRATEGY.SINGLE,
    )) as Member;
    if (!fetchedMember) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }

    await fetchedGroup.members.init();

    fetchedGroup.members.add(fetchedMember);
    this.dao.update(fetchedGroup);

    return groupId;
  }

  @log()
  public async deleteGroupMember(userId: number, groupId: number): Promise<number> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${groupId}` } });
    }

    const organization = await this.organizationService.get(fetchedGroup.organization.id);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${fetchedGroup.organization.id}` },
        friendly: false,
      });
    }

    const user = await this.userService.get(userId);
    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` } });
    }

    const fetchedMember = (await this.memberService.getByCriteria(
      { user, organization },
      FETCH_STRATEGY.SINGLE,
    )) as Member;
    if (!fetchedMember) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }

    await fetchedGroup.members.init();

    fetchedGroup.members.remove(fetchedMember);

    this.dao.update(fetchedGroup);

    return groupId;
  }
}
