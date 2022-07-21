import { NotFoundError, Unauthorized } from '@/Exceptions';
import { container, provideSingleton } from '@/di/index';

import { BadRequest } from '@/Exceptions/BadRequestError';
import { KeycloakApi } from '../keycloak/keycloakApi';

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
  async validateAccess(token: string, permissions: string[]): Promise<boolean> {
    if (permissions.length === 0) {
      throw new BadRequest('KEYCLOAK.NO_PERMISSIONS_PROVIDED');
    }

    const tokenInformation = await this.keycloakApi.extractInformationFromToken(token);
    //validate that the user is part of the current-org

    const currentOrganizationId = tokenInformation['current_org'];
    if (!currentOrganizationId) {
      throw new BadRequest('KEYCLOAK.NO_CURRENT_ORG_PROVIDED');
    }

    const groupById = await this.keycloakApi.getGroupById(currentOrganizationId);
    if (groupById.error || !groupById.getValue()) {
      throw new NotFoundError('KEYCLOAK.NON_EXISTANT_GROUP_BY_ID {{id}}');
    }
    const groupMemberships = tokenInformation.groups;
    if (groupMemberships.includes(`/${groupById.getValue().name}/${GROUP_PREFIX}-admins`)) {
      return true; // the user is an admin which means he does have access to the given resource
    }

    if (!groupMemberships.includes(`/${groupById.getValue().name}/${GROUP_PREFIX}-members`)) {
      //substring to remove the prefix-  aka org- from the group's name
      throw new Unauthorized('KEYCLOAK.USER_NOT_MEMBER_OF_ORG {{user}}{{org}}', {
        variables: { user: `${tokenInformation.name}`, org: `${groupById.getValue().name.substring(3)}` },
      });
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
    return doesUserHaveAccess;
  }
}
