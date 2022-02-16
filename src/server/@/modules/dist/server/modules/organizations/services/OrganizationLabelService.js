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
exports.OrganisationLabelService = void 0;
const index_1 = require("@di/index");
const BaseService_1 = require("@/modules/base/services/BaseService");
const IOrganizationLabelService_1 = require("../interfaces/IOrganizationLabelService");
const Organization_1 = require("@/modules/organizations/models/Organization");
const OrganizationLabel_1 = require("@/modules/organizations/models/OrganizationLabel");
const OrganizationLabelDao_1 = require("@/modules/organizations/daos/OrganizationLabelDao");
const Result_1 = require("@utils/Result");
const log_1 = require("@/decorators/log");
const safeGuard_1 = require("@/decorators/safeGuard");
let OrganisationLabelService = class OrganisationLabelService extends BaseService_1.BaseService {
    constructor(dao) {
        super(dao);
        this.dao = dao;
    }
    static getInstance() {
        return index_1.container.get(IOrganizationLabelService_1.IOrganizationLabelService);
    }
    createLabel(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const phone = yield this.dao.create(payload);
            return Result_1.Result.ok(phone.id);
        });
    }
    createBulkLabel(payload, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const labels = payload.map((el) => {
                return { name: el, organization };
            });
            this.dao.repository.persist(labels);
            return Result_1.Result.ok(200);
        });
    }
};
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrganizationLabel_1.OrganizationLabel]),
    __metadata("design:returntype", Promise)
], OrganisationLabelService.prototype, "createLabel", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Organization_1.Organization]),
    __metadata("design:returntype", Promise)
], OrganisationLabelService.prototype, "createBulkLabel", null);
OrganisationLabelService = __decorate([
    (0, index_1.provideSingleton)(IOrganizationLabelService_1.IOrganizationLabelService),
    __metadata("design:paramtypes", [OrganizationLabelDao_1.OrganizationLabelDao])
], OrganisationLabelService);
exports.OrganisationLabelService = OrganisationLabelService;
//# sourceMappingURL=OrganizationLabelService.js.map