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
var Resource_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("@/modules/organizations/models/Organization");
const ResourceCalendar_1 = require("./ResourceCalendar");
const User_1 = require("@/modules/users/models/User");
let Resource = Resource_1 = class Resource extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(Resource_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Resource.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Resource.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], Resource.prototype, "active", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Organization_1.Organization, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Organization_1.Organization)
], Resource.prototype, "organization", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Resource.prototype, "resourceType", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => User_1.User, onDelete: 'set null', nullable: true }),
    __metadata("design:type", User_1.User)
], Resource.prototype, "user", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'float8' }),
    __metadata("design:type", Number)
], Resource.prototype, "timeEfficiency", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResourceCalendar_1.ResourceCalendar }),
    __metadata("design:type", ResourceCalendar_1.ResourceCalendar)
], Resource.prototype, "calendar", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Resource.prototype, "timezone", void 0);
Resource = Resource_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], Resource);
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map