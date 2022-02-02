import { EnvConfig, ServerConfiguration, env } from '../types/ServerConfiguration';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
export class Configuration {
  private config: ServerConfiguration;
  constructor() {}

  static getInstance(): Configuration {
    return container.get(Configuration);
  }

  getConfiguration(): EnvConfig {
    return this.config[this.config.currentENV];
  }

  setCurrentEnv(env: env): void {
    this.config.currentENV = env;
  }

  getCurrentEnv(): env {
    return this.config.currentENV;
  }

  init() {
    this.config = {
      currentENV: (process.env.ENV as 'dev' | 'prod' | 'staging') || 'dev',
      dev: {
        baseConfig: { port: ((process.env.PORT as any) as number) || 3000 },
        DB: {
          host: '127.0.0.1',
          dbUsername: 'local-api',
          dbPassword: '1234',
          dbName: 'local',
          port: 5433,
        },
        keycloak: {
          username: 'admin',
          password: 'Pa55w0rd',
          grantType: 'password',
          clientId: 'admin-cli',
          realmName: 'master',
          baseUrl: 'http://localhost:8080/auth',
        },
      },
      staging: {
        baseConfig: { port: ((process.env.PORT as any) as number) || 3000 },
        DB: {
          host: 'api-dev.ctxnpdpnlwqz.ca-central-1.rds.amazonaws.com',
          dbUsername: 'postgres',
          dbPassword: 'Qv3eLFNm3i90',
          dbName: 'sciencewings_api_dev',
          port: 5432,
        },
        keycloak: {
          username: 'admin',
          password: 'sciencewings-keycloak',
          grantType: 'password',
          clientId: 'admin-cli',
          realmName: 'master',
          baseUrl: 'https://sciencewings-keycloak.herokuapp.com/auth',
        },
      },
      prod: {
        baseConfig: { port: ((process.env.PORT as any) as number) || 3000 },
        DB: {
          host: '127.0.0.1',
          dbUsername: 'admin',
          dbPassword: 'mana',
          dbName: 'mana',
          port: 5432,
        },
        keycloak: {
          username: 'admin',
          password: 'Pa55w0rd',
          grantType: 'password',
          clientId: 'admin-cli',
          baseUrl: 'https://sciencewings-keycloak.herokuapp.com',
        },
      },
    };
  }
}

/**
 * returns a key value in the server configuration
 * example:
 * configuration = {
 *  keycloak:{
 *   baseUrl : 'http://url.com'
 *  }
 * }
 *
 * getConfig('keycloak.baseUrl') returns 'http://url.com'
 *
 *
 * @param key a nested key in the server configuration
 */
export function getConfig(key: string) {
  const config = Configuration.getInstance().getConfiguration();
  const keys = key.split('.');
  return keys.reduce((prev, curr): any => {
    if (prev === undefined) return undefined;
    return prev[curr as keyof typeof config];
  }, config);
}
