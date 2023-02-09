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
import { Organization } from '@/modules/organizations/models/Organization';
import { GroupsList } from '@/types/types';

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
  public async getOrganizationGroup(
    organizationId: number,
    page?: number,
    size?: number,
    query?: string,
  ): Promise<GroupsList> {
    const organization = await this.organizationService.get(organizationId);

    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${organizationId}` } });
    }

    const length = await this.dao.count({ organization });

    let groups;

    if (page | size) {
      const skip = page * size;
      if (query) {
        groups = (await this.dao.getByCriteria(
          { organization, name: { $like: '%' + query + '%' } },
          FETCH_STRATEGY.ALL,
          {
            offset: skip,
            limit: size,
          },
        )) as Group[];
      } else {
        groups = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL, {
          offset: skip,
          limit: size,
        })) as Group[];
      }
      groups.map(async (group) => {
        if (!group.members.isInitialized) {
          await group.members.init();
        }
      });

      const { data, pagination } = paginate(groups, page, size, skip, length);
      const result: GroupsList = {
        data,
        pagination,
      };
      return result;
    }

    groups = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL)) as Group[];

    groups.map(async (group) => {
      if (!group.members.isInitialized) {
        await group.members.init();
      }
    });
    const result: GroupsList = {
      data: groups,
    };
    return result;
  }

  @log()
  public async getGroupMembers(groupId: number): Promise<Member[]> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${groupId}` } });
    }
    const members = (await this.memberService.getByCriteria({ group: fetchedGroup }, FETCH_STRATEGY.ALL)) as Member[];
    return members;
  }

  @log()
  @validate
  public async createGroup(@validateParam(CreateGroupSchema) payload: GroupRO): Promise<number> {
    const forkedGroupEntityManager = await this.dao.fork();
    forkedGroupEntityManager.begin();
    let createdGroup: Group;
    let organization: Organization;
    try {
      organization = (await this.organizationService.get(payload.organization)) as Organization;
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
      wrappedGroup.organization = organization;

      if (payload.parent) {
        const fetchedGroup = await this.dao.get(payload.parent);
        if (!fetchedGroup) {
          throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${payload.parent}` } });
        }
        wrappedGroup.parent = fetchedGroup;

        // add the new group as a subgroup of the parent grp
        const id = await this.keycloakUtils.createSubGroup(`${grpPrifix}${payload.name}`, fetchedGroup.kcid);
        wrappedGroup.kcid = id;
      } else {
        // add org group as parent
        const id = await this.keycloakUtils.createSubGroup(`${grpPrifix}${payload.name}`, organization.kcid);
        wrappedGroup.kcid = id;
      }
      createdGroup = await this.dao.transactionalCreate(wrappedGroup);

      if (payload.members) {
        //await createdGroup.members.init();
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
            await this.dao.transactionalUpdate(createdGroup);
            await this.keycloakUtils.addMemberToGroup(wrappedGroup.kcid, fetchedMember.user.keycloakId);
          }
          //return fetchedMember;
        });
      }
      forkedGroupEntityManager.commit();
    } catch (error) {
      forkedGroupEntityManager.rollback();
      this.keycloakUtils.deleteGroup(createdGroup.kcid);
      throw error;
    }
    this.dao.entitymanager.flush();
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
