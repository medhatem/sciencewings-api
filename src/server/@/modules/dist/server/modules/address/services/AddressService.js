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
exports.AddressService = void 0;
const index_1 = require("@di/index");
const AdressModel_1 = require("@/modules/address/models/AdressModel");
const AddressDAO_1 = require("@/modules/address/daos/AddressDAO");
const BaseService_1 = require("@/modules/base/services/BaseService");
const IAddressService_1 = require("../interfaces/IAddressService");
const Result_1 = require("@utils/Result");
const log_1 = require("@/decorators/log");
const safeGuard_1 = require("@/decorators/safeGuard");
let AddressService = class AddressService extends BaseService_1.BaseService {
    constructor(dao) {
        super(dao);
        this.dao = dao;
    }
    static getInstance() {
        return index_1.container.get(IAddressService_1.IAddressService);
    }
    createAddress(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.dao.create(payload);
            return Result_1.Result.ok(address);
        });
    }
    createBulkAddress(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload.map((el) => {
                const address = this.wrapEntity(this.dao.model, el);
                this.dao.repository.persist(address);
            });
            return Result_1.Result.ok(200);
        });
    }
};
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdressModel_1.Address]),
    __metadata("design:returntype", Promise)
], AddressService.prototype, "createAddress", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AddressService.prototype, "createBulkAddress", null);
AddressService = __decorate([
    (0, index_1.provideSingleton)(IAddressService_1.IAddressService),
    __metadata("design:paramtypes", [AddressDAO_1.AddressDao])
], AddressService);
exports.AddressService = AddressService;
//# sourceMappingURL=AddressService.js.map