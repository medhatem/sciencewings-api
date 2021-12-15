import 'module-alias/register';

import * as Config from '../../config.json';

import { EnvConfig, KeycloakConfig, ServerConfiguration } from '../../types/ServerConfiguration';
import { KcAdminClient, Keycloak } from '@sdks/keycloak';

class SeedKeycloak {
  constructor(public keycloakConfig: KeycloakConfig) {}

  async seed() {
    const keycloak = await Keycloak.getInstance();
    await keycloak.init(this.keycloakConfig);
    const keycloakAdminClient = keycloak.getAdminClient();
    this.seedClients(keycloakAdminClient);
  }

  async seedClients(keycloakAdminClient: KcAdminClient) {
    try {
      const client = await keycloakAdminClient.clients.findOne({
        id: 'api-postgres',
      });

      if (!client) {
        await keycloakAdminClient.clients.create({
          clientId: 'api-postgres',
          baseUrl: 'http://localhost:3000/',
        });
      }
    } catch (error) {
      console.log('Could not seed Keycloak clients');
    }
  }
}

// istanbul ignore next
if (process.argv[1].includes('dist/server/seeds/keycloak/index')) {
  (async () => {
    const envConfig = (Config as any)[
      ((process.env.ENV as any) as keyof ServerConfiguration) || (Config as any).currentENV || 'dev'
    ] as EnvConfig;
    new SeedKeycloak(envConfig.keycloak).seed();
  })();
}
