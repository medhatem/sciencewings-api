import { container, provide } from '@/di';

import GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import { Keycloak } from '../keycloak';
import { Result } from '@/utils/Result';
import { getConfig } from '@/configuration/Configuration';
import { safeGuard } from '@/decorators/safeGuard';

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
  async createGroup(name: string, parentId?: string): Promise<string> {
    let createdGroup: { id: string } = { id: null };
    if (parentId) {
      const subGroup = await this.createSubGroup(name, parentId);
      createdGroup = { id: subGroup };
    } else {
      createdGroup = await (await this.keycloak.getAdminClient()).groups.create({
        name,
        realm: getConfig('keycloak.clientValidation.realmName'),
      });
    }
    return createdGroup.id;
  }
  /**
   * creates a sub group in keycloak
   * the group will be nested in the parent group
   *
   * @param name of the sub organization
   * @param parentId represents the id of the parent organization
   */
  async createSubGroup(name: string, parentId: string): Promise<string> {
    const result = await (await this.keycloak.getAdminClient()).groups.setOrCreateChild(
      { id: parentId, realm: getConfig('keycloak.clientValidation.realmName') },
      {
        name,
      },
    );
    return result.id;
  }

  /**
   * deletes a keycloak group by id and returns the deleted group name
   *
   *
   * @param id of the group to delete
   */
  async deleteGroup(id: string): Promise<string> {
    // find the group before deleting it
    const groupToDelete = await this.getGroupById(id);
    await (await Keycloak.getInstance().getAdminClient()).groups.del({
      id,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });
    return groupToDelete.name;
  }

  /**
   *
   * add an owner attribute to the keycloak organization/group
   *
   * @param id of the group
   * @param name of the group
   * @param owner of the organization
   */
  async addOwnerToGroup(id: string, name: string, owner: string): Promise<any> {
    return await (await this.keycloak.getAdminClient()).groups.update(
      { id, realm: getConfig('keycloak.clientValidation.realmName') },
      { attributes: { owner: [owner] }, name },
    );
  }

  /**
   * fetches a keycloak group by id
   *
   * @param id of the group to fetch
   */
  async getGroupById(id: string): Promise<GroupRepresentation> {
    return await (await this.keycloak.getAdminClient()).groups.findOne({
      id,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });
  }

  /**
   * add a  member to a keycloak group
   *
   * @param groupId id of the group to add a member to
   * @param userId of the member to add
   */
  async addMemberToGroup(groupId: string, userId: string): Promise<string> {
    return await (await this.keycloak.getAdminClient()).users.addToGroup({
      id: userId,
      groupId,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });
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
    await (await this.keycloak.getAdminClient()).groups.update(
      { id: KcGroupid, realm: getConfig('keycloak.clientValidation.realmName') },
      {
        ...payload,
      },
    );
    return Result.ok();
  }
}
