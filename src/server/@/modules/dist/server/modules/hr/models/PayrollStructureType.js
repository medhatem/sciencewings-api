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
var PayrollStructureType_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollStructureType = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const ResCountry_1 = require("@/modules/organizations/models/ResCountry");
const ResourceCalendar_1 = require("@/modules/resources/models/ResourceCalendar");
let PayrollStructureType = PayrollStructureType_1 = class PayrollStructureType extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(PayrollStructureType_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], PayrollStructureType.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], PayrollStructureType.prototype, "name", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResourceCalendar_1.ResourceCalendar, onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResourceCalendar_1.ResourceCalendar)
], PayrollStructureType.prototype, "defaultResourceCalendar", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountry_1.ResCountry, onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResCountry_1.ResCountry)
], PayrollStructureType.prototype, "country", void 0);
PayrollStructureType = PayrollStructureType_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], PayrollStructureType);
exports.PayrollStructureType = PayrollStructureType;
//# sourceMappingURL=PayrollStructureType.js.map