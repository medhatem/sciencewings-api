import { container, provideSingleton, unmanaged } from '@/di/index';

import { Keycloak } from '@/sdks/keycloak';
import { KeycloakConfig } from '@/types/ServerConfiguration';
import { safeGuard } from '@/decorators/safeGuard';

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
export class Security {
  private url: string;
  private realm: string;
  constructor(private keycloak: Keycloak, @unmanaged() configuration: KeycloakConfig) {
    this.url = configuration.baseUrl;
    this.realm = configuration.clientValidation.realmName;
  }

  static getInstance(): Security {
    return container.get(Security);
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
}
