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

export type EnvConfig = {
  baseConfig?: BaseConfig;
  DB?: ServerDBConfig;
};

export type ServerConfiguration = {
  currentENV: 'dev' | 'prod' | 'staging';
  dev?: EnvConfig;
  prod?: EnvConfig;
  staging?: EnvConfig;
};
