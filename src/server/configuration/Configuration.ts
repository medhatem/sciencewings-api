import { EnvConfig, ServerConfiguration, env } from '../types/ServerConfiguration';
import { container, provideSingleton } from '@di/index';

import { LogLevel } from '@utils/Logger';

@provideSingleton()
export class Configuration {
  private config: ServerConfiguration;

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
        baseConfig: { port: (process.env.PORT as any as number) || 3000 },
        DB: {
          host: '127.0.0.1',
          dbUsername: 'localapi',
          dbPassword: 'localapi',
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
          clientValidation: {
            realmName: 'sciencewings-web',
          },
        },
        logger: {
          logLevel: LogLevel.INFO,
          displayAutoLogs: true,
          displayManualLogs: true,
          displayNoLogs: false,
        },
        email: {
          from: 'anahnah@sciencewings.com',
          sendGridApiKey:
            process.env.SENDGRID_API_KEY || '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',
        },
        email: {
          from: '',
          key: '',
        },
      },
      staging: {
        baseConfig: { port: (process.env.PORT as any as number) || 3000 },
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
          clientValidation: {
            realmName: 'sciencewings-web',
          },
        },
        logger: {
          logLevel: LogLevel.INFO,
          displayAutoLogs: true,
          displayManualLogs: true,
          displayNoLogs: false,
        },
        email: {
          from: '',
          sendGridApiKey: process.env.SENDGRID_API_KEY,
        },
        email: {
          from: '',
          key: '',
        },
      },
      prod: {
        baseConfig: { port: (process.env.PORT as any as number) || 3000 },
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
          clientValidation: {
            realmName: 'sciencewings-web',
          },
        },
        logger: {
          logLevel: LogLevel.INFO,
          displayAutoLogs: true,
          displayManualLogs: true,
          displayNoLogs: false,
        },
        email: {
          from: '',
          sendGridApiKey: process.env.SENDGRID_API_KEY,
        },
        email: {
          from: '',
          key: '',
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
