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
import { applyToAll } from '@/utils/utilities';
import { grpPrifix } from '@/modules/prifixConstants';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';

@provideSingleton(IGroupService)
export class GroupService extends BaseService<Group> implements IGroupService {
  constructor(
    public dao: GroupDAO,
    public organizationService: IOrganizationService,
    public memberService: IMemberService,
    public keycloakUtils: KeycloakUtil,
  ) {
    super(dao);
  }

  static getInstance(): IGroupService {
    return container.get(IGroupService);
  }

  @log()
  public async getOrganizationGroup(organizationId: number): Promise<Group[]> {
    const organization = await this.organizationService.get(organizationId);

    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_{{org}}', {
        variables: { org: `${organizationId}` },
        isOperational: true,
      });
    }

    return (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL)) as Group[];
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
      parent: payload.parent,
      description: payload.description,
    });

    wrappedGroup.organization = organization;

    const id = await this.keycloakUtils.createSubGroup(`${grpPrifix}${payload.name}`, organization.kcid);

    wrappedGroup.kcid = id;
    const createdGroup = await this.dao.create(wrappedGroup);
    if (payload.members) {
      await createdGroup.members.init();
      await applyToAll(payload.members, async (member) => {
        const fetchedMember = await this.memberService.getByCriteria(
          { user: member, organization: payload.organization },
          FETCH_STRATEGY.SINGLE,
        );

        if (fetchedMember !== null) {
          createdGroup.members.add(fetchedMember);
          await this.keycloakUtils.addMemberToGroup(wrappedGroup.kcid, fetchedMember.user.keycloakId);
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
  @validate
  public async addGroupMember(member: any, groupId: number): Promise<number> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${groupId}` } });
    }
    const fetchedMember = await this.memberService.getByCriteria(
      {
        user: member.user,
        organization: member.organization,
      },
      FETCH_STRATEGY.SINGLE,
    );
    if (!fetchedMember) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }

    if (!fetchedGroup.members.isInitialized) fetchedGroup.members.init();

    fetchedGroup.members.add(fetchedMember);
    this.dao.update(fetchedGroup);

    return groupId;
  }

  @log()
  @validate
  public async deleteGroupMember(member: any, groupId: number): Promise<number> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      throw new NotFoundError('GROUP.NON_EXISTANT {{group}}', { variables: { group: `${groupId}` } });
    }
    const fetchedMember = await this.memberService.getByCriteria(
      {
        user: member.user,
        organization: member.organization,
      },
      FETCH_STRATEGY.SINGLE,
    );
    if (!fetchedMember) {
      throw new NotFoundError('MEMBER.NON_EXISTANT');
    }

    if (!fetchedGroup.members.isInitialized) fetchedGroup.members.init();

    fetchedGroup.members.remove(fetchedMember);

    this.dao.update(fetchedGroup);

    return groupId;
  }
}
