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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserExctractionAndValidation = void 0;
const IUserService_1 = require("../modules/users/interfaces/IUserService");
const Result_1 = require("@utils/Result");
const node_fetch_1 = require("node-fetch");
const Configuration_1 = require("../configuration/Configuration");
const di_1 = require("../di");
let UserExctractionAndValidation = class UserExctractionAndValidation {
    constructor(userService) {
        this.userService = userService;
        /**
         *
         * Calls keycloak to validate whether the token is valid or not
         * if the token is not valid throw an Unauthorized error
         * if the token is valid add the keycloak user information into the request
         *
         * @param req express request
         */
        this.userExctractionAndValidation = (req) => __awaiter(this, void 0, void 0, function* () {
            if (!req.headers || !req.headers.authorization) {
                return Result_1.Result.fail('Not Authorized');
            }
            const token = req.headers.authorization;
            const res = yield (0, node_fetch_1.default)(`${(0, Configuration_1.getConfig)('keycloak.baseUrl')}/realms/${(0, Configuration_1.getConfig)('keycloak.clientValidation.realmName')}/protocol/openid-connect/userinfo`, {
                method: 'get',
                headers: {
                    Authorization: `${token}`,
                },
            });
            const result = yield res.json();
            if (result.error) {
                return Result_1.Result.fail('Not Authorized');
            }
            const criteriaResult = yield this.userService.getUserByCriteria({ email: result.email });
            if (criteriaResult.isFailure) {
                return Result_1.Result.fail('Unrecognized user!');
            }
            let userId = criteriaResult.getValue() ? criteriaResult.getValue().id : null;
            if (!criteriaResult) {
                const registerUserResult = yield this.userService.registerUser(result);
                if (registerUserResult.isFailure) {
                    return Result_1.Result.fail('Unexpected Error!');
                }
                userId = registerUserResult.getValue();
            }
            req.keycloakUser = result;
            req.userId = userId;
            return Result_1.Result.ok({ keycloakUser: result, userId });
        });
    }
};
UserExctractionAndValidation = __decorate([
    (0, di_1.provideSingleton)(),
    __metadata("design:paramtypes", [IUserService_1.IUserService])
], UserExctractionAndValidation);
exports.UserExctractionAndValidation = UserExctractionAndValidation;
//# sourceMappingURL=userExctractionAndValidation.js.map