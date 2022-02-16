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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceService = void 0;
const index_1 = require("@di/index");
const BaseService_1 = require("@/modules/base/services/BaseService");
const RequestObject_1 = require("../routes/RequestObject");
const CreateResourceSchema_1 = require("../schemas/CreateResourceSchema");
const ResourceDao_1 = require("../daos/ResourceDao");
const Result_1 = require("@utils/Result");
const CreateResourceSchema_2 = require("./../schemas/CreateResourceSchema");
const safeGuard_1 = require("@/decorators/safeGuard");
const log_1 = require("@/modules/../decorators/log");
const interfaces_1 = require("../interfaces");
const interfaces_2 = require("@/modules/users/interfaces");
const interfaces_3 = require("@/modules/organizations/interfaces");
const validateParam_1 = require("@/decorators/validateParam");
const validate_1 = require("@/decorators/validate");
let ResourceService = class ResourceService extends BaseService_1.BaseService {
    constructor(dao, userService, organisationService, resourceCalendarService) {
        super(dao);
        this.dao = dao;
        this.userService = userService;
        this.organisationService = organisationService;
        this.resourceCalendarService = resourceCalendarService;
    }
    static getInstance() {
        return index_1.container.get(interfaces_1.IResourceService);
    }
    createResource(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            let organization = null;
            if (payload.user) {
                const _user = yield this.userService.getUserByCriteria({ id: payload.user });
                if (!_user) {
                    return Result_1.Result.fail(`User with id ${payload.user} does not exist.`);
                }
                user = yield _user.getValue();
            }
            if (payload.organization) {
                const _organization = yield this.organisationService.get(payload.organization);
                if (!_organization) {
                    return Result_1.Result.fail(`Organization with id ${payload.organization} does not exist.`);
                }
                organization = yield _organization.getValue();
            }
            const calendar = payload.calendar;
            delete payload.calendar;
            payload.organization = organization;
            const resource = this.wrapEntity(this.dao.model, payload);
            const createResourceCalendar = yield this.resourceCalendarService.createResourceCalendar(calendar);
            if (createResourceCalendar.isFailure) {
                return Result_1.Result.fail(createResourceCalendar.error);
            }
            resource.calendar = createResourceCalendar.getValue();
            const createdResource = yield this.create(Object.assign(Object.assign({}, resource), { user }));
            if (createdResource.isFailure) {
                return Result_1.Result.fail(createdResource.error);
            }
            const id = createdResource.getValue().id;
            return Result_1.Result.ok(id);
        });
    }
    updateResource(payload, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedResource = yield this.dao.get(resourceId);
            if (!fetchedResource) {
                return Result_1.Result.fail(`Resource with id ${resourceId} does not exist.`);
            }
            let user = null;
            if (payload.user) {
                const _user = yield this.userService.getUserByCriteria({ id: payload.user });
                if (!_user) {
                    return Result_1.Result.fail(`User with id ${payload.user} does not exist.`);
                }
                user = _user.getValue();
            }
            if (payload.organization) {
                const _organization = yield this.organisationService.get(payload.organization);
                if (!_organization) {
                    return Result_1.Result.fail(`Organization with id ${payload.organization} does not exist.`);
                }
                payload.organization = yield _organization.getValue();
            }
            if (payload.calendar) {
                delete payload.calendar;
                const updatedResourceCalendar = yield this.resourceCalendarService.update(payload.calendar);
                if (updatedResourceCalendar.isFailure) {
                    return Result_1.Result.fail(updatedResourceCalendar.error);
                }
                payload.calendar = yield updatedResourceCalendar.getValue();
            }
            const resource = this.wrapEntity(fetchedResource, Object.assign(Object.assign({}, fetchedResource), payload));
            const createdResource = yield this.create(Object.assign(Object.assign({}, resource), { user }));
            if (createdResource.isFailure) {
                return Result_1.Result.fail(createdResource.error);
            }
            const id = createdResource.getValue().id;
            return Result_1.Result.ok(id);
        });
    }
};
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    validate_1.validate,
    __param(0, (0, validateParam_1.validateParam)(CreateResourceSchema_1.CreateResourceSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestObject_1.CreateResourceRO]),
    __metadata("design:returntype", Promise)
], ResourceService.prototype, "createResource", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    validate_1.validate,
    __param(0, (0, validateParam_1.validateParam)(CreateResourceSchema_2.UpdateResourceSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestObject_1.CreateResourceRO, Number]),
    __metadata("design:returntype", Promise)
], ResourceService.prototype, "updateResource", null);
ResourceService = __decorate([
    (0, index_1.provideSingleton)(interfaces_1.IResourceService),
    __metadata("design:paramtypes", [ResourceDao_1.ResourceDao,
        interfaces_2.IUserService,
        interfaces_3.IOrganizationService,
        interfaces_1.IResourceCalendarService])
], ResourceService);
exports.ResourceService = ResourceService;
//# sourceMappingURL=ResourceService.js.map