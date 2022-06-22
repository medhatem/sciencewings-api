import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Group } from '@/modules/hr/models/Group';
import { GroupDAO } from '@/modules/hr/daos/GroupDAO';
import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { GroupRO } from '@/modules/hr/routes/RequestObject';
import { getConfig } from '@/configuration/Configuration';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';
import { CreateGroupSchema, UpdateGroupSchema } from '@/modules/hr/schemas/GroupSchema';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { applyToAll } from '@/utils/utilities';

@provideSingleton(IGroupService)
export class GroupService extends BaseService<Group> implements IGroupService {
  constructor(
    public dao: GroupDAO,
    public organizationService: IOrganizationService,
    public memberService: IMemberService,
  ) {
    super(dao);
  }

  static getInstance(): IGroupService {
    return container.get(IGroupService);
  }

  @log()
  @safeGuard()
  public async getOrganizationGroup(organizationId: number): Promise<Result<any>> {
    const fetchedorganization = await this.organizationService.get(organizationId);

    if (fetchedorganization.isFailure || fetchedorganization.getValue() === null) {
      return Result.notFound(`Organization with id ${organizationId} does not exist.`);
    }

    const groups = await this.dao.getByCriteria({ organization: fetchedorganization.getValue() }, FETCH_STRATEGY.ALL);
    return Result.ok(groups);
  }

  @log()
  @safeGuard()
  public async getGroupMembers(groupId: number): Promise<Result<any>> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      return Result.notFound(`group with id ${groupId} does not exist.`);
    }
    await fetchedGroup.members.init();
    return Result.ok(fetchedGroup.members);
  }

  @log()
  @safeGuard()
  @validate
  public async createGroup(@validateParam(CreateGroupSchema) payload: GroupRO): Promise<Result<number>> {
    const fetchedorganization = await this.organizationService.get(payload.organization);

    if (fetchedorganization.isFailure || fetchedorganization.getValue() === null) {
      return Result.notFound(`organization with id ${payload.organization} does not exist.`);
    }

    const fetchedorganizationValue = fetchedorganization.getValue();
    const wrappedGroup = this.wrapEntity(new Group(), {
      name: payload.name,
      active: payload.active,
      parent: payload.parent,
      description: payload.description,
    });

    wrappedGroup.organization = fetchedorganizationValue;

    const { id } = await this.keycloak.getAdminClient().groups.setOrCreateChild(
      { id: fetchedorganizationValue.kcid, realm: getConfig('keycloak.clientValidation.realmName') },
      {
        name: payload.name,
      },
    );
    wrappedGroup.kcid = id;
    const createdGroup = await this.dao.create(wrappedGroup);
    if (payload.members) {
      await createdGroup.members.init();
      await applyToAll(payload.members, async (member) => {
        const fetchedMember = await this.memberService.getByCriteria(
          { user: member, organization: payload.organization },
          FETCH_STRATEGY.SINGLE,
        );
        if (fetchedMember.isFailure) {
          return fetchedMember;
        }
        if (fetchedMember.isSuccess && fetchedMember.getValue() !== null) {
          const fetchedMemberValue = fetchedMember.getValue();

          createdGroup.members.add(fetchedMemberValue);
          await this.keycloak.getAdminClient().users.addToGroup({
            id: fetchedMemberValue.user.keycloakId,
            groupId: wrappedGroup.kcid,
            realm: getConfig('keycloak.clientValidation.realmName'),
          });
        }

        return fetchedMember;
      });
    }

    return Result.ok<number>(createdGroup.id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateGroup(
    @validateParam(UpdateGroupSchema) payload: GroupRO,
    groupId: number,
  ): Promise<Result<number>> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      return Result.notFound(`group with id ${groupId} does not exist.`);
    }

    if (fetchedGroup.name !== payload.name) {
      try {
        await this.keycloak.getAdminClient().groups.update(
          { id: fetchedGroup.kcid, realm: getConfig('keycloak.clientValidation.realmName') },
          {
            name: payload.name,
          },
        );
      } catch (e) {
        return Result.notFound(e);
      }
    }

    this.wrapEntity(fetchedGroup, {
      ...fetchedGroup,
      ...payload,
    });
    return Result.ok<number>(1);
  }

  @log()
  @safeGuard()
  public async deleteGroup(groupId: number): Promise<Result<number>> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      return Result.notFound(`group with id ${groupId} does not exist.`);
    }
    try {
      await this.keycloak.getAdminClient().groups.del({
        id: fetchedGroup.kcid,
        realm: getConfig('keycloak.clientValidation.realmName'),
      });
      await this.dao.remove(fetchedGroup);
    } catch (error) {
      return Result.fail(error.response.data);
    }

    return Result.ok<number>(groupId);
  }

  @log()
  @safeGuard()
  @validate
  public async addGroupMember(member: any, groupId: number): Promise<Result<number>> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      return Result.notFound(`group with id ${groupId} does not exist.`);
    }
    const fetchedMember = await this.memberService.getByCriteria(
      {
        user: member.user,
        organization: member.organization,
      },
      FETCH_STRATEGY.SINGLE,
    );
    if (fetchedMember.isFailure || fetchedMember.getValue() === null) {
      return Result.notFound(`member does not exist.`);
    }

    if (!fetchedGroup.members.isInitialized) fetchedGroup.members.init();

    fetchedGroup.members.add(fetchedMember.getValue());
    this.dao.update(fetchedGroup);

    return Result.ok(groupId);
  }

  @log()
  @safeGuard()
  @validate
  public async deleteGroupMember(member: any, groupId: number): Promise<Result<number>> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      return Result.notFound(`group with id ${groupId} does not exist.`);
    }
    const fetchedMember = await this.memberService.getByCriteria(
      {
        user: member.user,
        organization: member.organization,
      },
      FETCH_STRATEGY.SINGLE,
    );
    if (fetchedMember.isFailure || fetchedMember.getValue() === null) {
      return Result.notFound(`member does not exist.`);
    }

    if (!fetchedGroup.members.isInitialized) fetchedGroup.members.init();

    fetchedGroup.members.remove(fetchedMember.getValue());

    this.dao.update(fetchedGroup);

    return Result.ok(groupId);
  }
}
