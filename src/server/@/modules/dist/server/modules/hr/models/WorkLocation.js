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
var WorkLocation_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkLocation = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("@/modules/organizations/models/Organization");
const ResPartner_1 = require("@/modules/organizations/models/ResPartner");
let WorkLocation = WorkLocation_1 = class WorkLocation extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(WorkLocation_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], WorkLocation.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], WorkLocation.prototype, "active", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], WorkLocation.prototype, "name", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Organization_1.Organization }),
    __metadata("design:type", Organization_1.Organization)
], WorkLocation.prototype, "organization", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResPartner_1.ResPartner }),
    __metadata("design:type", ResPartner_1.ResPartner)
], WorkLocation.prototype, "address", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], WorkLocation.prototype, "locationNumber", void 0);
WorkLocation = WorkLocation_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], WorkLocation);
exports.WorkLocation = WorkLocation;
//# sourceMappingURL=WorkLocation.js.map