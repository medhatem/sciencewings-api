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
var ResourceCalendar_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceCalendar = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("@/modules/organizations/models/Organization");
let ResourceCalendar = ResourceCalendar_1 = class ResourceCalendar extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResourceCalendar_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResourceCalendar.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResourceCalendar.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResourceCalendar.prototype, "active", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Organization_1.Organization, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Organization_1.Organization)
], ResourceCalendar.prototype, "organization", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'float8', nullable: true }),
    __metadata("design:type", Number)
], ResourceCalendar.prototype, "hoursPerDay", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResourceCalendar.prototype, "timezone", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResourceCalendar.prototype, "twoWeeksCalendar", void 0);
ResourceCalendar = ResourceCalendar_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResourceCalendar);
exports.ResourceCalendar = ResourceCalendar;
//# sourceMappingURL=ResourceCalendar.js.map