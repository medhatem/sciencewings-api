import { getConfig } from '@/configuration/Configuration';
import { safeGuard } from '@/decorators/safeGuard';
import { provideSingleton, unmanaged } from '@/di';
import { KeycloakConfig } from '@/types/ServerConfiguration';
import { Result } from '@/utils/Result';
import GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import fetch from 'node-fetch';
import { Keycloak } from './index';
export type UserInformationFromToken = {
  sub: string;
  email_verified: boolean;
  name: string;
  groups: string[];
  roles: string[];
  current_company: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

@provideSingleton()
export class KeycloakApi {
  private url: string;
  private realm: string;
  constructor(private keycloak: Keycloak, @unmanaged() configuration: KeycloakConfig = getConfig('keycloak')) {
    this.url = configuration.baseUrl;
    this.realm = configuration.clientValidation.realmName;
  }

  /**
   * extract user information from a given keycloak token
   * using keycloak api
   *
   *
   * @param token keycloak token
   */
  @safeGuard()
  async extractInformationFromToken(token: string): Promise<UserInformationFromToken> {
    const res = await fetch(`${this.url}/realms/${this.realm}/protocol/openid-connect/userinfo`, {
      method: 'get',
      headers: {
        Authorization: `${token}`,
      },
    });

    return await res.json();
  }

  /**
   * retrieve a group's details by criterias
   *
   *
   * @param criteria to search for example {name: test, path: grp/test }
   * @param token the token to use an auth
   */
  @safeGuard()
  async getGroupByName(name: string): Promise<Result<GroupRepresentation>> {
    const groups = await this.keycloak.getAdminClient().groups.find({ realm: this.realm, search: name });
    return Result.ok<GroupRepresentation>(groups[0]);
  }
  /**
   * retrieve a group's details by id
   *
   *
   * @param id of the group to search for in keycloak
   * @param token to use an auth
   */
  @safeGuard()
  async getGroupById(id: string): Promise<Result<GroupRepresentation>> {
    const group = await this.keycloak.getAdminClient().groups.findOne({ id, realm: this.realm });
    return Result.ok<GroupRepresentation>(group);
  }
}
