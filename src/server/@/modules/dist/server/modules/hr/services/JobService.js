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
exports.JobService = void 0;
const __1 = require("..");
const index_1 = require("@di/index");
const BaseService_1 = require("@/modules/base/services/BaseService");
let JobService = class JobService extends BaseService_1.BaseService {
    constructor(dao) {
        super(dao);
        this.dao = dao;
    }
    static getInstance() {
        return index_1.container.get(__1.IJobService);
    }
};
JobService = __decorate([
    (0, index_1.provideSingleton)(__1.IJobService),
    __metadata("design:paramtypes", [__1.JobDAO])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=JobService.js.map