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

export type KeycloakConfig = {
  username: string;
  password: string;
  grantType: GrantTypes;
  'client-id': string;
};

export type EnvConfig = {
  baseConfig?: BaseConfig;
  DB?: ServerDBConfig;
  keycloak: KeycloakConfig;
};

export type ServerConfiguration = {
  currentENV: 'dev' | 'prod' | 'staging';
  dev?: EnvConfig;
  prod?: EnvConfig;
  staging?: EnvConfig;
};
