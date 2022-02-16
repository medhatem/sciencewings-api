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
exports.ResourceCalendarService = void 0;
const index_1 = require("@di/index");
const BaseService_1 = require("@/modules/base/services/BaseService");
const RequestObject_1 = require("../routes/RequestObject");
const IOrganizationService_1 = require("@/modules/organizations/interfaces/IOrganizationService");
const Result_1 = require("@utils/Result");
const log_1 = require("@/decorators/log");
const safeGuard_1 = require("@/decorators/safeGuard");
const ResourceCalendarDAO_1 = require("../daos/ResourceCalendarDAO");
const CreateResourceSchema_1 = require("../schemas/CreateResourceSchema");
const interfaces_1 = require("../interfaces");
const validateParam_1 = require("@/decorators/validateParam");
const validate_1 = require("@/decorators/validate");
let ResourceCalendarService = class ResourceCalendarService extends BaseService_1.BaseService {
    constructor(dao, organisationService) {
        super(dao);
        this.dao = dao;
        this.organisationService = organisationService;
    }
    static getInstance() {
        return index_1.container.get(interfaces_1.IResourceCalendarService);
    }
    createResourceCalendar(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let org = null;
            let organization = null;
            if (payload.organization) {
                org = yield this.organisationService.get(payload.organization);
                if (!org) {
                    return Result_1.Result.fail(`Organization with id ${payload.organization} does not exist.`);
                }
                organization = yield org.getValue();
            }
            const resourceCalendar = Object.assign(Object.assign({ id: null }, payload), { organization });
            const createdResourceCalendar = yield this.dao.create(resourceCalendar);
            return Result_1.Result.ok(createdResourceCalendar);
        });
    }
};
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    validate_1.validate,
    __param(0, (0, validateParam_1.validateParam)(CreateResourceSchema_1.ResourceCalendarSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestObject_1.CreateResourceCalendarRO]),
    __metadata("design:returntype", Promise)
], ResourceCalendarService.prototype, "createResourceCalendar", null);
ResourceCalendarService = __decorate([
    (0, index_1.provideSingleton)(interfaces_1.IResourceCalendarService),
    __metadata("design:paramtypes", [ResourceCalendarDAO_1.ResourceCalendarDao, IOrganizationService_1.IOrganizationService])
], ResourceCalendarService);
exports.ResourceCalendarService = ResourceCalendarService;
//# sourceMappingURL=ResourceCalendarService.js.map