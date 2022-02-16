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
exports.PhoneService = void 0;
const index_1 = require("@di/index");
const BaseService_1 = require("@/modules/base/services/BaseService");
const IPhoneService_1 = require("../interfaces/IPhoneService");
const Organization_1 = require("@/modules/organizations/models/Organization");
const PhoneDTO_1 = require("@/modules/phones/dtos/PhoneDTO");
const PhoneDAO_1 = require("@/modules/phones/daos/PhoneDAO");
const Result_1 = require("@utils/Result");
const User_1 = require("@/modules/users/models/User");
const log_1 = require("@/decorators/log");
const safeGuard_1 = require("@/decorators/safeGuard");
let PhoneService = class PhoneService extends BaseService_1.BaseService {
    constructor(dao) {
        super(dao);
        this.dao = dao;
    }
    static getInstance() {
        return index_1.container.get(IPhoneService_1.IPhoneService);
    }
    createPhone(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.wrapEntity(this.dao.model, payload);
            const phone = yield this.dao.create(entity);
            return Result_1.Result.ok(phone);
        });
    }
    createBulkPhoneForUser(payload, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const phones = yield Promise.all(payload.map((phone) => __awaiter(this, void 0, void 0, function* () {
                const wrappedPhone = this.wrapEntity(this.dao.model, phone);
                wrappedPhone.user = entity;
            })));
            this.dao.repository.persist(phones);
            return Result_1.Result.ok(200);
        });
    }
    createBulkPhoneForOrganization(payload, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const phones = yield Promise.all(payload.map((phone) => __awaiter(this, void 0, void 0, function* () {
                const wrappedPhone = this.wrapEntity(this.dao.model, phone);
                wrappedPhone.organization = entity;
                return wrappedPhone;
            })));
            this.dao.repository.persist(phones);
            return Result_1.Result.ok(200);
        });
    }
};
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PhoneDTO_1.PhoneDTO]),
    __metadata("design:returntype", Promise)
], PhoneService.prototype, "createPhone", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, User_1.User]),
    __metadata("design:returntype", Promise)
], PhoneService.prototype, "createBulkPhoneForUser", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Organization_1.Organization]),
    __metadata("design:returntype", Promise)
], PhoneService.prototype, "createBulkPhoneForOrganization", null);
PhoneService = __decorate([
    (0, index_1.provideSingleton)(IPhoneService_1.IPhoneService),
    __metadata("design:paramtypes", [PhoneDAO_1.PhoneDao])
], PhoneService);
exports.PhoneService = PhoneService;
//# sourceMappingURL=PhoneService.js.map