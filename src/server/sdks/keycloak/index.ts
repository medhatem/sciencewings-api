import { container, provideSingleton } from '@/di/index';

import KcAdminClient from '@keycloak/keycloak-admin-client';
import { getConfig } from '@/configuration/Configuration';
import { requiredAction } from '@keycloak/keycloak-admin-client';

export { KcAdminClient, requiredAction };

@provideSingleton()
export class Keycloak {
  private kcAdminClient: KcAdminClient;

  constructor() {
    this.kcAdminClient = new KcAdminClient({
      baseUrl: getConfig('keycloak.baseUrl'),
      realmName: getConfig('keycloak.realmName'),
    });
  }

  static getInstance(): Keycloak {
    return container.get(Keycloak);
  }

  async getAdminClient() {
    if (!this.kcAdminClient.keycloak || this.kcAdminClient.keycloak.isTokenExpired()) {
      await this.init(); //authenticate again since token is expired
    }
    return this.kcAdminClient;
  }

  async init() {
    // Authorize with username / password
    await this.kcAdminClient.auth({
      username: getConfig('keycloak.username'),
      password: getConfig('keycloak.password'),
      grantType: getConfig('keycloak.grantType'),
      clientId: getConfig('keycloak.clientId'),
      //   totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
    });
  }
}
