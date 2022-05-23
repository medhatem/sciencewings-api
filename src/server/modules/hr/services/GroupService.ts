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
import { CreateGroupSchema, UpdateGroupMember, UpdateGroupSchema } from '@/modules/hr/schemas/GroupSchema';
import { FETCH_STRATEGY } from '@/modules/base';
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
    console.log({ organizationId, fetchedorganization });

    if (fetchedorganization.isFailure || fetchedorganization.getValue() === null) {
      return Result.notFound(`Organization with id ${organizationId} does not exist.`);
    }

    const groups = await this.dao.getByCriteria({ organization: organizationId }, FETCH_STRATEGY.ALL);
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
      note: payload.note,
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
          console.log({ error: fetchedMember.error });
        }
        if (fetchedMember.isSuccess && fetchedMember.getValue() !== null) {
          const fetchedMemberValue = fetchedMember.getValue();
          console.log({ fetchedMemberValue });

          createdGroup.members.add(fetchedMemberValue);
          await this.keycloak.getAdminClient().users.addToGroup({
            id: fetchedMemberValue.user.keycloakId,
            groupId: wrappedGroup.kcid,
            realm: getConfig('keycloak.clientValidation.realmName'),
          });
        }
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
        console.log({ e });
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
  public async updateGroupMember(
    @validateParam(UpdateGroupMember) payload: GroupRO,
    groupId: number,
  ): Promise<Result<number>> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      return Result.notFound(`group with id ${groupId} does not exist.`);
    }

    let existingMembers = [...(await fetchedGroup.members.init())];
    let requestedMembers = [...payload.members];
    const newMembers: any = [];

    await applyToAll(payload.members, async ({ user }) => {
      let flagIsExiste = false;
      for (const existingMember in existingMembers) {
        if ((existingMember as any).user.id === user.id) {
          flagIsExiste = true;
          existingMembers = existingMembers.filter((el: any) => el.user.id !== user.id);
          requestedMembers = requestedMembers.filter((el: any) => el.user.id !== user.id);
          break;
        }
      }
      if (!flagIsExiste) {
        newMembers.push(user.id);
      }
    });

    await applyToAll(payload.members as any, async ({ user }: any) => {
      this.keycloak.getAdminClient().users.addToGroup({
        id: user.keycloakId,
        groupId: fetchedGroup.kcid,
      });
      fetchedGroup.members.add({
        user,
        organization: fetchedGroup.organization,
      } as any);
    });
    await applyToAll(existingMembers, async (member: any) => {
      await this.keycloak.getAdminClient().users.delFromGroup({
        id: member.user.keycloakId,
        groupId: fetchedGroup.kcid,
      });
      await this.dao.remove(member);
    });

    return Result.ok<number>(1);
  }
}
