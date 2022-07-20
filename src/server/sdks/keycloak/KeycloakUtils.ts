import { container, provide } from '@/di';

import GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import { Keycloak } from '../keycloak';
import { Result } from '@/utils/Result';
import { getConfig } from '@/configuration/Configuration';
import { safeGuard } from '@/decorators/safeGuard';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

/**
 * utilities class containing keycloak specific actions
 * This class will manage all keycloak calls and encapsulate them
 *
 */
@provide()
export class KeycloakUtil {
  constructor(private keycloak: Keycloak) {}

  static getInstance(): KeycloakUtil {
    return container.get(KeycloakUtil);
  }

  /**
   * creates a new group in keycloak
   *
   * @param name of the organization to create
   * @param parentId
   */
  @safeGuard()
  async createGroup(name: string, parentId?: string): Promise<Result<string>> {
    let createdGroup: { id: string } = { id: null };
    if (parentId) {
      const subGroup = await this.createSubGroup(name, parentId);
      if (subGroup.isFailure) {
        return Result.fail('sub group could not be created');
      }
      createdGroup = { id: subGroup.getValue() };
    } else {
      createdGroup = await (
        await this.keycloak.getAdminClient()
      ).groups.create({
        name,
        realm: getConfig('keycloak.clientValidation.realmName'),
      });
    }
    return Result.ok(createdGroup.id);
  }
  /**
   * creates a sub group in keycloak
   * the group will be nested in the parent group
   *
   * @param name of the sub organization
   * @param parentId represents the id of the parent organization
   */
  @safeGuard()
  async createSubGroup(name: string, parentId: string): Promise<Result<string>> {
    const result = await (
      await this.keycloak.getAdminClient()
    ).groups.setOrCreateChild(
      { id: parentId, realm: getConfig('keycloak.clientValidation.realmName') },
      {
        name,
      },
    );
    return Result.ok(result.id);
  }

  /**
   * deletes a keycloak group by id and returns the deleted group name
   *
   *
   * @param id of the group to delete
   */
  @safeGuard()
  async deleteGroup(id: string): Promise<Result<string>> {
    // find the group before deleting it
    const groupToDelete = await this.getGroupById(id);

    if (groupToDelete.isFailure) {
      return Result.notFound(`group with id ${id} does not exist.`);
    }
    await (
      await Keycloak.getInstance().getAdminClient()
    ).groups.del({
      id,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });
    return Result.ok(groupToDelete.getValue().name);
  }

  /**
   *
   * add an owner attribute to the keycloak organization/group
   *
   * @param id of the group
   * @param name of the group
   * @param owner of the organization
   */
  @safeGuard()
  async addOwnerToGroup(id: string, name: string, owner: string): Promise<Result<any>> {
    await (
      await this.keycloak.getAdminClient()
    ).groups.update(
      { id, realm: getConfig('keycloak.clientValidation.realmName') },
      { attributes: { owner: [owner] }, name },
    );
    return Result.ok();
  }

  /**
   * fetches a keycloak group by id
   *
   * @param id of the group to fetch
   */
  @safeGuard()
  async getGroupById(id: string): Promise<Result<GroupRepresentation>> {
    const group = await (
      await this.keycloak.getAdminClient()
    ).groups.findOne({
      id,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });
    return Result.ok(group);
  }

  /**
   * add a  member to a keycloak group
   *
   * @param groupId id of the group to add a member to
   * @param userId of the member to add
   */
  @safeGuard()
  async addMemberToGroup(groupId: string, userId: string): Promise<Result<string>> {
    const addedMember = await (
      await this.keycloak.getAdminClient()
    ).users.addToGroup({
      id: userId,
      groupId,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });
    return Result.ok(addedMember);
  }

  /**
   *
   * update a Kc group name
   *
   * @param KcGroupid of the group
   * @param newName of the group
   */
  @safeGuard()
  async updateGroup(KcGroupid: string, payload: GroupRepresentation): Promise<Result<any>> {
    await (
      await this.keycloak.getAdminClient()
    ).groups.update(
      { id: KcGroupid, realm: getConfig('keycloak.clientValidation.realmName') },
      {
        ...payload,
      },
    );
    return Result.ok();
  }

  /*
   * fetches a keycloak users by email
   *
   * @param email to get users by
   */
  @safeGuard()
  async getUsersByEmail(email: string): Promise<Result<UserRepresentation[]>> {
    const users = await (
      await this.keycloak.getAdminClient()
    ).users.find({
      email,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });

    return Result.ok(users);
  }

  /*
   * reset a keycloak user password
   *
   * @param id of the user to fetch
   * @param newPassword the new password
   */
  @safeGuard()
  async resetPassword(id: string, newPassword: string): Promise<Result<any>> {
    await (
      await this.keycloak.getAdminClient()
    ).users.resetPassword({
      realm: getConfig('keycloak.clientValidation.realmName'),
      id,
      credential: {
        temporary: false,
        type: 'password',
        value: newPassword,
      },
    });
    return Result.ok();
  }
}
