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
exports.BaseDao = void 0;
const Logger_1 = require("@/modules/../utils/Logger");
const ServerError_1 = require("@/modules/../errors/ServerError");
const index_1 = require("@/modules/../db/index");
const log_1 = require("@/decorators/log");
const di_1 = require("@/di");
let BaseDao = class BaseDao {
    constructor(model) {
        this.model = model;
        this.repository = index_1.connection.em.getRepository(model.constructor);
        this.logger = Logger_1.Logger.getInstance();
    }
    static getInstance() {
        throw new ServerError_1.ServerError('baseModel must be overriden');
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne(id);
        });
    }
    /**
     * fetches using a given search criteria
     *
     * @param criteria the criteria to fetch with
     */
    getByCriteria(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne(criteria);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info(`${this.model.constructor.name}s`);
            return this.repository.findAll();
        });
    }
    create(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.repository.create(entry); //generate an entity from a payload
            yield this.repository.persistAndFlush(entity);
            return entity;
        });
    }
    update(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.persistAndFlush(entry);
            return entry;
        });
    }
    remove(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.removeAndFlush(entry);
            return entry;
        });
    }
};
__decorate([
    (0, log_1.log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BaseDao.prototype, "get", null);
__decorate([
    (0, log_1.log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseDao.prototype, "getByCriteria", null);
__decorate([
    (0, log_1.log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseDao.prototype, "getAll", null);
__decorate([
    (0, log_1.log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseDao.prototype, "create", null);
__decorate([
    (0, log_1.log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseDao.prototype, "update", null);
__decorate([
    (0, log_1.log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseDao.prototype, "remove", null);
BaseDao = __decorate([
    (0, di_1.provideSingleton)(),
    __metadata("design:paramtypes", [Object])
], BaseDao);
exports.BaseDao = BaseDao;
//# sourceMappingURL=BaseDao.js.map