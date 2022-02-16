export declare type BaseConfig = {
    port?: number;
};
export declare type ServerDBConfig = {
    host: string;
    dbUsername: string;
    dbPassword: string;
    dbName: string;
    port: number;
};
export declare type GrantTypes = 'client_credentials' | 'password';
export declare type env = 'dev' | 'prod' | 'staging';
export declare type KeycloakConfig = {
    username: string;
    password: string;
    grantType: GrantTypes;
    clientId: string;
    baseUrl: string;
    realmName?: string;
    clientValidation?: {
        realmName: string;
    };
};
export declare type LoggerConfig = {
    logLevel: string;
    displayAutoLogs?: boolean;
    displayManualLogs?: boolean;
    displayNoLogs?: boolean;
};
export declare type EmailConfig = {
    from: string;
    sendGridApiKey: string;
};
export declare type EnvConfig = {
    baseConfig?: BaseConfig;
    DB?: ServerDBConfig;
    keycloak: KeycloakConfig;
    logger?: LoggerConfig;
    email?: EmailConfig;
};
export declare type ServerConfiguration = {
    currentENV: env;
    dev?: EnvConfig;
    prod?: EnvConfig;
    staging?: EnvConfig;
};
