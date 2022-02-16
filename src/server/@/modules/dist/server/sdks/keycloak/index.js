"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Keycloak_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keycloak = exports.requiredAction = exports.KcAdminClient = void 0;
const index_1 = require("@di/index");
const keycloak_admin_client_1 = require("@keycloak/keycloak-admin-client");
exports.KcAdminClient = keycloak_admin_client_1.default;
const Configuration_1 = require("@/modules/configuration/Configuration");
const keycloak_admin_client_2 = require("@keycloak/keycloak-admin-client");
Object.defineProperty(exports, "requiredAction", { enumerable: true, get: function () { return keycloak_admin_client_2.requiredAction; } });
let Keycloak = Keycloak_1 = class Keycloak {
    constructor() {
        this.kcAdminClient = new keycloak_admin_client_1.default({
            baseUrl: (0, Configuration_1.getConfig)('keycloak.baseUrl'),
            realmName: (0, Configuration_1.getConfig)('keycloak.realmName'),
        });
    }
    static getInstance() {
        return index_1.container.get(Keycloak_1);
    }
    getAdminClient() {
        return this.kcAdminClient;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Authorize with username / password
            yield this.kcAdminClient.auth({
                username: (0, Configuration_1.getConfig)('keycloak.username'),
                password: (0, Configuration_1.getConfig)('keycloak.password'),
                grantType: (0, Configuration_1.getConfig)('keycloak.grantType'),
                clientId: (0, Configuration_1.getConfig)('keycloak.clientId'),
                //   totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
            });
        });
    }
};
Keycloak = Keycloak_1 = __decorate([
    (0, index_1.provideSingleton)(),
    __metadata("design:paramtypes", [])
], Keycloak);
exports.Keycloak = Keycloak;
//# sourceMappingURL=index.js.map