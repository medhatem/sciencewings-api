import { container, provideSingleton } from '@/di/index';

import { KeycloakApi } from '../keycloak/keycloakApi';
import { Result } from '@/utils/Result';
import { safeGuard } from '@/decorators/safeGuard';

export const ORG_PREFIX = 'org';
export const GROUP_PREFIX = 'grp';

@provideSingleton()
export class Security {
  constructor(private keycloakApi: KeycloakApi) {}

  static getInstance(): Security {
    return container.get(Security);
  }

  /**
   * validate if the given user has access to the route/resource
   * by parsing their token and searching if they have roles that
   * fulfil the list of permissions for the route/resource they are accessing
   *
   *
   * @param token to use for auth
   * @param permissions array containing all the roles that allow accessing the resource
   */
  @safeGuard()
  async validateAccess(token: string, permissions: string[]): Promise<Result<boolean>> {
    if (permissions.length === 0) {
      return Result.fail('No permissions to validate');
    }

    const tokenInformation = await this.keycloakApi.extractInformationFromToken(token);
    //validate that the user is part of the current-org

    const currentOrganizationId = tokenInformation['current_org'];
    if (!currentOrganizationId) {
      return Result.fail('No current company is given to validate the access');
    }

    const groupById = await this.keycloakApi.getGroupById(currentOrganizationId);
    if (groupById.error || !groupById.getValue()) {
      return Result.fail(`No keycloak group found with id ${currentOrganizationId}`);
    }
    const groupMemberships = tokenInformation.groups;
    if (groupMemberships.includes(`/${groupById.getValue().name}/${GROUP_PREFIX}-admins`)) {
      return Result.ok(true); // the user is an admin which means he does have access to the given resource
    }

    if (!groupMemberships.includes(`/${groupById.getValue().name}/${GROUP_PREFIX}-members`)) {
      //substring to remove the prefix-  aka org- from the group's name
      return Result.fail(
        `The user ${
          tokenInformation.name
        } Does not have access since they are not a member of ${groupById.getValue().name.substring(3)} `,
      );
    }
    // only keep groups and get rid of the organizations
    const subGroups = groupById.getValue().subGroups.filter((sub) => sub.name.startsWith(GROUP_PREFIX));
    let doesUserHaveAccess = false;

    for (const sub of subGroups) {
      for (const role of sub.realmRoles) {
        if (permissions.includes(role)) {
          // break of the loop as soon as we find one matching role
          // this would mean that the user does have access to the route/resource
          doesUserHaveAccess = true;
          break;
        }
      }
    }
    return Result.ok(doesUserHaveAccess);
  }
}
