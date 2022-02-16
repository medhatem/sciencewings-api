"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Configuration_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.Configuration = void 0;
const index_1 = require("@di/index");
const Logger_1 = require("@utils/Logger");
let Configuration = Configuration_1 = class Configuration {
    static getInstance() {
        return index_1.container.get(Configuration_1);
    }
    getConfiguration() {
        return this.config[this.config.currentENV];
    }
    setCurrentEnv(env) {
        this.config.currentENV = env;
    }
    getCurrentEnv() {
        return this.config.currentENV;
    }
    init() {
        this.config = {
            currentENV: process.env.ENV || 'dev',
            dev: {
                baseConfig: { port: process.env.PORT || 3000 },
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
                    logLevel: Logger_1.LogLevel.INFO,
                    displayAutoLogs: true,
                    displayManualLogs: true,
                    displayNoLogs: false,
                },
                email: {
                    from: 'anahnah@sciencewings.com',
                    sendGridApiKey: process.env.SENDGRID_API_KEY || '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',
                },
            },
            staging: {
                baseConfig: { port: process.env.PORT || 3000 },
                DB: {
                    host: 'api-dev.ctxnpdpnlwqz.ca-central-1.rds.amazonaws.com',
                    dbUsername: 'postgres',
                    dbPassword: 'Qv3eLFNm3i90',
                    dbName: 'sciencewings_api_dev',
                    port: 5432,
                },
                keycloak: {
                    username: 'admin',
                    password: 'Pa55w0rd',
                    grantType: 'password',
                    clientId: 'admin-cli',
                    realmName: 'master',
                    baseUrl: 'http://keycloak-app-staging-env.eba-fsrexfym.ca-central-1.elasticbeanstalk.com/auth',
                    clientValidation: {
                        realmName: 'sciencewings-web',
                    },
                },
                logger: {
                    logLevel: Logger_1.LogLevel.INFO,
                    displayAutoLogs: true,
                    displayManualLogs: true,
                    displayNoLogs: false,
                },
                email: {
                    from: '',
                    sendGridApiKey: process.env.SENDGRID_API_KEY,
                },
            },
            prod: {
                baseConfig: { port: process.env.PORT || 3000 },
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
                    logLevel: Logger_1.LogLevel.INFO,
                    displayAutoLogs: true,
                    displayManualLogs: true,
                    displayNoLogs: false,
                },
                email: {
                    from: '',
                    sendGridApiKey: process.env.SENDGRID_API_KEY,
                },
            },
        };
    }
};
Configuration = Configuration_1 = __decorate([
    (0, index_1.provideSingleton)()
], Configuration);
exports.Configuration = Configuration;
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
function getConfig(key) {
    const config = Configuration.getInstance().getConfiguration();
    const keys = key.split('.');
    return keys.reduce((prev, curr) => {
        if (prev === undefined)
            return undefined;
        return prev[curr];
    }, config);
}
exports.getConfig = getConfig;
//# sourceMappingURL=Configuration.js.map