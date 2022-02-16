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
exports.BaseService = void 0;
const core_1 = require("@mikro-orm/core");
const BaseDao_1 = require("../daos/BaseDao");
const IBaseService_1 = require("../interfaces/IBaseService");
const keycloak_1 = require("@sdks/keycloak");
const Logger_1 = require("@/modules/../utils/Logger");
const loggerStorage_1 = require("@/decorators/loggerStorage");
const Result_1 = require("@utils/Result");
const ServerError_1 = require("@errors/ServerError");
const log_1 = require("@/decorators/log");
const di_1 = require("@/di");
const safeGuard_1 = require("@/decorators/safeGuard");
let BaseService = class BaseService {
    constructor(dao, keycloak = keycloak_1.Keycloak.getInstance()) {
        this.dao = dao;
        this.keycloak = keycloak;
        this.logger = Logger_1.Logger.getInstance();
    }
    static getInstance() {
        throw new ServerError_1.ServerError('baseService must be overriden!');
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Result_1.Result.ok(yield this.dao.get(id));
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return Result_1.Result.ok(yield this.dao.getAll());
        });
    }
    create(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return Result_1.Result.ok(yield this.dao.create(entry));
            }
            catch (error) {
                return Result_1.Result.fail(error);
            }
        });
    }
    update(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return Result_1.Result.ok(this.dao.update(entry));
            }
            catch (error) {
                return Result_1.Result.fail(error);
            }
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = this.wrapEntity(this.dao.model, { id });
                return Result_1.Result.ok(yield this.dao.remove(entity));
            }
            catch (error) {
                return Result_1.Result.fail(error);
            }
        });
    }
    getByCriteria(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getByCriteria(criteria);
        });
    }
    /**
     * serialize a json object into an mikro-orm entity/model
     *
     * @param entity the entity/model to serialize on an return
     * @param payload the data to serialize
     * @param options for assign options
     *
     */
    wrapEntity(entity, payload, options = true) {
        return (0, core_1.wrap)(entity).assign(payload, options);
    }
};
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "get", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "getAll", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "create", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "update", null);
__decorate([
    (0, log_1.log)(),
    (0, safeGuard_1.safeGuard)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "remove", null);
__decorate([
    (0, loggerStorage_1.LoggerStorage)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "getByCriteria", null);
BaseService = __decorate([
    (0, di_1.provideSingleton)(IBaseService_1.IBaseService),
    __metadata("design:paramtypes", [BaseDao_1.BaseDao, keycloak_1.Keycloak])
], BaseService);
exports.BaseService = BaseService;
//# sourceMappingURL=BaseService.js.map