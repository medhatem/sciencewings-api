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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var UserRoutes_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const typescript_rest_1 = require("typescript-rest");
const index_1 = require("@di/index");
const BaseRoutes_1 = require("@/modules/base/routes/BaseRoutes");
const constants_1 = require("@/modules/../authenticators/constants");
const typescript_rest_swagger_1 = require("typescript-rest-swagger");
const RegisterUserFromTokenDTO_1 = require("@/modules/users/dtos/RegisterUserFromTokenDTO");
const UserDTO_1 = require("@/modules/users/dtos/UserDTO");
const RequstObjects_1 = require("./RequstObjects");
const UserUpdateDTO_1 = require("@/modules/users/dtos/UserUpdateDTO");
const loggerStorage_1 = require("@/decorators/loggerStorage");
const CreatedUserDTO_1 = require("@/modules/users/dtos/CreatedUserDTO");
const IUserService_1 = require("../interfaces/IUserService");
let UserRoutes = UserRoutes_1 = class UserRoutes extends BaseRoutes_1.BaseRoutes {
    constructor(userService) {
        super(userService, new UserDTO_1.UserDTO(), new UserUpdateDTO_1.UpdateUserDTO());
        this.userService = userService;
    }
    static getInstance() {
        return index_1.container.get(UserRoutes_1);
    }
    /**
     * Registers a new user in the database
     * this route is called after signup
     * since keycloak takes care of creating the user
     * we parse the user data from the keycloak token
     * and save it to the database
     *
     * @param request
     */
    registerUserFromToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.registerUser(request.keycloakUser);
            if (result.isFailure) {
                return new RegisterUserFromTokenDTO_1.RegisterUserFromTokenDTO().serialize({
                    error: { statusCode: 500, errorMessage: result.error },
                });
            }
            return new RegisterUserFromTokenDTO_1.RegisterUserFromTokenDTO().serialize({
                body: { statusCode: 201, userId: result.getValue() },
            });
        });
    }
    /**
     *  Method that resets a user password in keycloak
     *
     * @param payload
     */
    resetPassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.resetPassword(payload);
            if (result.isFailure) {
                return new RegisterUserFromTokenDTO_1.ResetPasswordDTO().serialize({
                    error: { statusCode: 500, errorMessage: result.error },
                });
            }
            return new RegisterUserFromTokenDTO_1.ResetPasswordDTO().serialize({
                body: { statusCode: 200, message: result.getValue() },
            });
        });
    }
    /**
     * Update user details
     * Must be authentificated
     * @param payload: User object
     */
    updateUserDetails(payload, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.updateUserDetails(payload, request.userId);
            if (result.isFailure) {
                return new CreatedUserDTO_1.CreatedUserDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
            }
            return new CreatedUserDTO_1.CreatedUserDTO().serialize({ body: { createdOrgId: result.getValue(), statusCode: 204 } });
        });
    }
    /**
     * Get user By auth token
     */
    getUserByKeycloakId(keycloakId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.getUserByKeycloakId(keycloakId);
            if (result.isFailure) {
                return new UserDTO_1.UserDTO().serialize({ error: { statusCode: 404, errorMessage: result.error } });
            }
            const user = result.getValue();
            const organizations = (yield user.organizations.init()).toArray().map((org) => {
                return { id: org.id, name: org.name };
            });
            return new UserDTO_1.UserDTO().serialize({ body: { user: Object.assign(Object.assign({}, user), { organizations }), statusCode: 200 } });
        });
    }
};
__decorate([
    typescript_rest_1.POST,
    (0, typescript_rest_1.Path)('registerUserFromToken'),
    (0, typescript_rest_swagger_1.Response)(201, 'User Registred Successfully'),
    (0, typescript_rest_1.Security)([], constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __param(0, typescript_rest_1.ContextRequest),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRoutes.prototype, "registerUserFromToken", null);
__decorate([
    typescript_rest_1.POST,
    (0, typescript_rest_1.Path)('resetPassword'),
    (0, typescript_rest_swagger_1.Response)(201, 'Password reset successfully'),
    (0, typescript_rest_1.Security)([], constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequstObjects_1.ResetPasswordRO]),
    __metadata("design:returntype", Promise)
], UserRoutes.prototype, "resetPassword", null);
__decorate([
    typescript_rest_1.PUT,
    (0, typescript_rest_1.Path)('updateUserDetail'),
    (0, typescript_rest_1.Security)([], constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __param(1, typescript_rest_1.ContextRequest),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequstObjects_1.UserDetailsRO, Object]),
    __metadata("design:returntype", Promise)
], UserRoutes.prototype, "updateUserDetails", null);
__decorate([
    typescript_rest_1.GET,
    (0, typescript_rest_1.Path)('getUserByKeycloakId/:kcid'),
    (0, loggerStorage_1.LoggerStorage)(),
    __param(0, (0, typescript_rest_1.PathParam)('kcid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRoutes.prototype, "getUserByKeycloakId", null);
UserRoutes = UserRoutes_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, typescript_rest_1.Path)('users'),
    __metadata("design:paramtypes", [IUserService_1.IUserService])
], UserRoutes);
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=UserRoutes.js.map