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
var ResourceCalendarAttendance_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceCalendarAttendance = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Resource_1 = require("./Resource");
const ResourceCalendar_1 = require("./ResourceCalendar");
let ResourceCalendarAttendance = ResourceCalendarAttendance_1 = class ResourceCalendarAttendance extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResourceCalendarAttendance_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResourceCalendarAttendance.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResourceCalendarAttendance.prototype, "name", void 0);
__decorate([
    (0, core_1.Index)({ name: 'resource_calendar_attendance_dayofweek_index' }),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResourceCalendarAttendance.prototype, "dayofweek", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], ResourceCalendarAttendance.prototype, "dateFrom", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], ResourceCalendarAttendance.prototype, "dateTo", void 0);
__decorate([
    (0, core_1.Index)({ name: 'resource_calendar_attendance_hour_from_index' }),
    (0, core_1.Property)({ columnType: 'float8' }),
    __metadata("design:type", Number)
], ResourceCalendarAttendance.prototype, "hourFrom", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'float8' }),
    __metadata("design:type", Number)
], ResourceCalendarAttendance.prototype, "hourTo", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResourceCalendar_1.ResourceCalendar, onDelete: 'cascade' }),
    __metadata("design:type", ResourceCalendar_1.ResourceCalendar)
], ResourceCalendarAttendance.prototype, "calendar", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResourceCalendarAttendance.prototype, "dayPeriod", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Resource_1.Resource, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Resource_1.Resource)
], ResourceCalendarAttendance.prototype, "resource", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResourceCalendarAttendance.prototype, "weekType", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResourceCalendarAttendance.prototype, "displayType", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], ResourceCalendarAttendance.prototype, "sequence", void 0);
ResourceCalendarAttendance = ResourceCalendarAttendance_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResourceCalendarAttendance);
exports.ResourceCalendarAttendance = ResourceCalendarAttendance;
//# sourceMappingURL=ResourceCalendarAttendance.js.map