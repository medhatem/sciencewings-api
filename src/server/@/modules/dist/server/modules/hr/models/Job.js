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
var Job_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules//base/models/BaseModel");
const Group_1 = require("./Group");
const Organization_1 = require("@/modules//organizations/models/Organization");
let Job = Job_1 = class Job extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(Job_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Job.prototype, "id", void 0);
__decorate([
    (0, core_1.Index)({ name: 'hr_job_name_index' }),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Job.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "description", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Group_1.Group, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Group_1.Group)
], Job.prototype, "group", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Organization_1.Organization, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Organization_1.Organization)
], Job.prototype, "organization", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Job.prototype, "state", void 0);
Job = Job_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Unique)({ name: 'hr_job_name_organization_uniq', properties: ['name', 'group', 'organization'] }),
    __metadata("design:paramtypes", [])
], Job);
exports.Job = Job;
//# sourceMappingURL=Job.js.map