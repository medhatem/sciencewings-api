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
var Contract_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const ContractType_1 = require("./ContractType");
const Group_1 = require("./Group");
const Job_1 = require("./Job");
const Member_1 = require("./Member");
const Organization_1 = require("@/modules/organizations/models/Organization");
const PayrollStructureType_1 = require("./PayrollStructureType");
const ResourceCalendar_1 = require("@/modules/resources/models/ResourceCalendar");
const User_1 = require("@/modules/users/models/User");
let Contract = Contract_1 = class Contract extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(Contract_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Contract.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Contract.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], Contract.prototype, "active", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => PayrollStructureType_1.PayrollStructureType, onDelete: 'set null', nullable: true }),
    __metadata("design:type", PayrollStructureType_1.PayrollStructureType)
], Contract.prototype, "structureType", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Member_1.Member, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Member_1.Member)
], Contract.prototype, "member", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Group_1.Group, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Group_1.Group)
], Contract.prototype, "group", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Job_1.Job, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Job_1.Job)
], Contract.prototype, "job", void 0);
__decorate([
    (0, core_1.Index)({ name: 'hr_contract_date_start_index' }),
    (0, core_1.Property)({ columnType: 'date' }),
    __metadata("design:type", Date)
], Contract.prototype, "dateStart", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "dateEnd", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "trialDateEnd", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => ResourceCalendar_1.ResourceCalendar,
        onDelete: 'set null',
        nullable: true,
        index: 'hr_contract_resource_calendar_id_index',
    }),
    __metadata("design:type", ResourceCalendar_1.ResourceCalendar)
], Contract.prototype, "resourceCalendar", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'numeric' }),
    __metadata("design:type", Number)
], Contract.prototype, "wage", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "notes", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "state", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Organization_1.Organization }),
    __metadata("design:type", Organization_1.Organization)
], Contract.prototype, "organization", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ContractType_1.ContractType, onDelete: 'set null', nullable: true }),
    __metadata("design:type", ContractType_1.ContractType)
], Contract.prototype, "contractType", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "kanbanState", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => User_1.User, onDelete: 'set null', nullable: true }),
    __metadata("design:type", User_1.User)
], Contract.prototype, "hrResponsible", void 0);
Contract = Contract_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], Contract);
exports.Contract = Contract;
//# sourceMappingURL=Contract.js.map