import { EnvConfig, env } from '../types/ServerConfiguration';
export declare class Configuration {
    private config;
    static getInstance(): Configuration;
    getConfiguration(): EnvConfig;
    setCurrentEnv(env: env): void;
    getCurrentEnv(): env;
    init(): void;
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
export declare function getConfig(key: string): any;
