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
var OrganizationRoutes_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRoutes = void 0;
const index_1 = require("@di/index");
const BaseRoutes_1 = require("@/modules/base/routes/BaseRoutes");
const typescript_rest_1 = require("typescript-rest");
const constants_1 = require("@/modules/../authenticators/constants");
const RequestObject_1 = require("./RequestObject");
const OrganizationDTO_1 = require("@/modules/organizations/dtos/OrganizationDTO");
const loggerStorage_1 = require("@/decorators/loggerStorage");
const typescript_rest_swagger_1 = require("typescript-rest-swagger");
const UpdateOrganizationDTO_1 = require("@/modules/organizations/dtos/UpdateOrganizationDTO");
const InviteUserDTO_1 = require("@/modules/organizations/dtos/InviteUserDTO");
const IOrganizationService_1 = require("../interfaces/IOrganizationService");
let OrganizationRoutes = OrganizationRoutes_1 = class OrganizationRoutes extends BaseRoutes_1.BaseRoutes {
    constructor(OrganizationService) {
        super(OrganizationService, new OrganizationDTO_1.OrganizationDTO(), new UpdateOrganizationDTO_1.UpdateOrganizationDTO());
        this.OrganizationService = OrganizationService;
    }
    static getInstance() {
        return index_1.container.get(OrganizationRoutes_1);
    }
    createOrganization(payload, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.OrganizationService.createOrganization(payload, request.userId);
            if (result.isFailure) {
                return new OrganizationDTO_1.OrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
            }
            return new OrganizationDTO_1.OrganizationDTO().serialize({ body: { createdOrgId: result.getValue(), statusCode: 201 } });
        });
    }
    /**
     * invite a user to an organization
     * creates the newly invited user in keycloak
     *
     * @param payload
     */
    inviteUserToOrganization(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.OrganizationService.inviteUserByEmail(payload.email, payload.organizationId);
            if (result.isFailure) {
                return new InviteUserDTO_1.InviteUserDTO().serialize({
                    error: { statusCode: 500, errorMessage: result.error },
                });
            }
            return new InviteUserDTO_1.InviteUserDTO().serialize({
                body: { statusCode: 201, userId: result.getValue() },
            });
        });
    }
    /**
     * retrive users that belongs to an organization
     *
     * @param id: organization id
     */
    getUsers(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.OrganizationService.getMembers(payload);
            if (result.isFailure) {
                return new OrganizationDTO_1.OrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
            }
            return new OrganizationDTO_1.OrganizationDTO().serialize({ body: { members: result.getValue(), statusCode: 201 } });
        });
    }
    /**
     * retrieve all the organizations a given user is a member of
     *
     * @param id: user id
     */
    getUserOrganizations(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.OrganizationService.getUserOrganizations(payload);
            if (result.isFailure) {
                return new OrganizationDTO_1.OrganizationDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
            }
            return new OrganizationDTO_1.OrganizationDTO().serialize({ body: { organizations: result.getValue(), statusCode: 201 } });
        });
    }
};
__decorate([
    typescript_rest_1.POST,
    (0, typescript_rest_1.Path)('createOrganization'),
    (0, typescript_rest_1.Security)('', constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __param(1, typescript_rest_1.ContextRequest),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestObject_1.CreateOrganizationRO, Object]),
    __metadata("design:returntype", Promise)
], OrganizationRoutes.prototype, "createOrganization", null);
__decorate([
    typescript_rest_1.POST,
    (0, typescript_rest_1.Path)('inviteUserToOrganization'),
    (0, typescript_rest_swagger_1.Response)(201, 'User Registred Successfully'),
    (0, typescript_rest_1.Security)([], constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestObject_1.UserInviteToOrgRO]),
    __metadata("design:returntype", Promise)
], OrganizationRoutes.prototype, "inviteUserToOrganization", null);
__decorate([
    typescript_rest_1.GET,
    (0, typescript_rest_1.Path)('getMembers/:id'),
    (0, typescript_rest_1.Security)('', constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __param(0, (0, typescript_rest_1.PathParam)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationRoutes.prototype, "getUsers", null);
__decorate([
    typescript_rest_1.GET,
    (0, typescript_rest_1.Path)('getUserOrganizations/:id'),
    (0, typescript_rest_1.Security)('', constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __param(0, (0, typescript_rest_1.PathParam)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizationRoutes.prototype, "getUserOrganizations", null);
OrganizationRoutes = OrganizationRoutes_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, typescript_rest_1.Path)('organization'),
    __metadata("design:paramtypes", [IOrganizationService_1.IOrganizationService])
], OrganizationRoutes);
exports.OrganizationRoutes = OrganizationRoutes;
//# sourceMappingURL=OrganizationRoutes.js.map