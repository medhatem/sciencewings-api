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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
const index_1 = require("@di/index");
const BaseService_1 = require("@/modules/base/services/BaseService");
const ContractDao_1 = require("../daos/ContractDao");
const IContractService_1 = require("../interfaces/IContractService");
let ContractService = class ContractService extends BaseService_1.BaseService {
    constructor(dao) {
        super(dao);
        this.dao = dao;
    }
    static getInstance() {
        return index_1.container.get(IContractService_1.IContractService);
    }
};
ContractService = __decorate([
    (0, index_1.provideSingleton)(IContractService_1.IContractService),
    __metadata("design:paramtypes", [ContractDao_1.ContractDao])
], ContractService);
exports.ContractService = ContractService;
//# sourceMappingURL=ContractService.js.map