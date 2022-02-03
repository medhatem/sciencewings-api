export type BaseConfig = {
  port?: number;
};

export type ServerDBConfig = {
  host: string;
  dbUsername: string;
  dbPassword: string;
  dbName: string;
  port: number;
};

export declare type GrantTypes = 'client_credentials' | 'password';
export declare type env = 'dev' | 'prod' | 'staging';

export type KeycloakConfig = {
  username: string;
  password: string;
  grantType: GrantTypes;
  clientId: string;
  baseUrl: string;
  realmName?: string;
};

export type EmailConfig = {
  from: string;
  key: string;
};

export type EnvConfig = {
  baseConfig?: BaseConfig;
  DB?: ServerDBConfig;
  keycloak: KeycloakConfig;
  email: EmailConfig;
};

export type ServerConfiguration = {
  currentENV: env;
  dev?: EnvConfig;
  prod?: EnvConfig;
  staging?: EnvConfig;
};
