import { NotFoundError } from '@/Exceptions';
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

    //decode the token
    const tokenInformation = await this.keycloakApi.extractInformationFromToken(token);
    const realmAccess = tokenInformation?.realm_access;

    // Access the `roles` array within the `realm_access` claim
    const userRoles = realmAccess?.roles;

    //validate that the user is part of the current-org
    const currentOrganizationId = tokenInformation['current_org'];
    if (!currentOrganizationId) {
      throw new BadRequest('KEYCLOAK.NO_CURRENT_ORG_PROVIDED');
    }

    const groupById = await this.keycloakApi.getGroupById(currentOrganizationId);
    if (!groupById) {
      throw new NotFoundError('KEYCLOAK.NON_EXISTANT_GROUP_BY_ID {{id}}');
    }
    //
    if (userRoles.includes(`${currentOrganizationId}-admin`)) {
      return true; // the user is an admin which means he does have access to the given resource
    }

    let doesUserHaveAccess = false;
    for (let permission of permissions) {
      permission = permission.replace('{orgId}', currentOrganizationId);
      if (userRoles.includes(permission)) {
        // break of the loop as soon as we find one matching role
        // this would mean that the user does have access to the route/resource
        doesUserHaveAccess = true;
        break;
      }
    }

    return doesUserHaveAccess;
  }
}
