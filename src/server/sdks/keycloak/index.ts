import { container, provideSingleton } from '@di/index';

import KcAdminClient from '@keycloak/keycloak-admin-client';
import { KeycloakConfig } from '../../types/ServerConfiguration';

export { KcAdminClient };

@provideSingleton()
export class Keycloak {
  private kcAdminClient: KcAdminClient;
  constructor() {
    this.kcAdminClient = new KcAdminClient();
  }

  static getInstance(): Keycloak {
    return container.get(Keycloak);
  }

  getAdminClient() {
    return this.kcAdminClient;
  }

  async init(config: KeycloakConfig) {
    // Authorize with username / password
    await this.kcAdminClient.auth({
      username: config.username,
      password: config.password,
      grantType: config.grantType,
      clientId: config['client-id'],
      //   totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
    });
  }
}
