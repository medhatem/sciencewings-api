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
var ResourceCalendarLeaves_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceCalendarLeaves = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("@/modules/organizations/models/Organization");
const Resource_1 = require("./Resource");
const ResourceCalendar_1 = require("./ResourceCalendar");
let ResourceCalendarLeaves = ResourceCalendarLeaves_1 = class ResourceCalendarLeaves extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResourceCalendarLeaves_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResourceCalendarLeaves.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResourceCalendarLeaves.prototype, "name", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Organization_1.Organization, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Organization_1.Organization)
], ResourceCalendarLeaves.prototype, "organization", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => ResourceCalendar_1.ResourceCalendar,
        onDelete: 'set null',
        nullable: true,
        index: 'resource_calendar_leaves_calendar_id_index',
    }),
    __metadata("design:type", ResourceCalendar_1.ResourceCalendar)
], ResourceCalendarLeaves.prototype, "calendar", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'timestamp', length: 6 }),
    __metadata("design:type", Date)
], ResourceCalendarLeaves.prototype, "dateFrom", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'timestamp', length: 6 }),
    __metadata("design:type", Date)
], ResourceCalendarLeaves.prototype, "dateTo", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Resource_1.Resource,
        onDelete: 'set null',
        nullable: true,
        index: 'resource_calendar_leaves_resource_id_index',
    }),
    __metadata("design:type", Resource_1.Resource)
], ResourceCalendarLeaves.prototype, "resource", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResourceCalendarLeaves.prototype, "timeType", void 0);
ResourceCalendarLeaves = ResourceCalendarLeaves_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResourceCalendarLeaves);
exports.ResourceCalendarLeaves = ResourceCalendarLeaves;
//# sourceMappingURL=ResourceCalendarLeaves.js.map