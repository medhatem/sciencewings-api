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
var Member_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const __1 = require("@/modules/..");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Contract_1 = require("./Contract");
const Group_1 = require("./Group");
const Job_1 = require("./Job");
const Organization_1 = require("@/modules/organizations/models/Organization");
const Phone_1 = require("@/modules/phones/models/Phone");
const ResCountry_1 = require("@/modules/organizations/models/ResCountry");
const ResPartnerBank_1 = require("@/modules/organizations/models/ResPartnerBank");
const Resource_1 = require("@/modules/resources/models/Resource");
const ResourceCalendar_1 = require("@/modules/resources/models/ResourceCalendar");
const User_1 = require("@/modules/users/models/User");
const WorkLocation_1 = require("./WorkLocation");
let Member = Member_1 = class Member extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(Member_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Member.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Resource_1.Resource, index: 'hr_member_resource_id_index' }),
    __metadata("design:type", Resource_1.Resource)
], Member.prototype, "resource", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Organization_1.Organization, onDelete: 'set null', index: 'hr_member_organization_id_index' }),
    __metadata("design:type", Organization_1.Organization)
], Member.prototype, "organization", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => ResourceCalendar_1.ResourceCalendar,
        onDelete: 'set null',
        nullable: true,
        index: 'hr_member_resource_calendar_id_index',
    }),
    __metadata("design:type", ResourceCalendar_1.ResourceCalendar)
], Member.prototype, "resourceCalendar", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], Member.prototype, "active", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Group_1.Group, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Group_1.Group)
], Member.prototype, "group", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Job_1.Job, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Job_1.Job)
], Member.prototype, "job", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "jobTitle", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => __1.Address, onDelete: 'set null', nullable: true }),
    __metadata("design:type", __1.Address)
], Member.prototype, "address", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Phone_1.Phone, nullable: true }),
    __metadata("design:type", Phone_1.Phone)
], Member.prototype, "workPhone", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Phone_1.Phone, nullable: true }),
    __metadata("design:type", Phone_1.Phone)
], Member.prototype, "mobilePhone", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "workEmail", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => WorkLocation_1.WorkLocation, onDelete: 'set null', nullable: true }),
    __metadata("design:type", WorkLocation_1.WorkLocation)
], Member.prototype, "workLocation", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => User_1.User, onDelete: 'set null', nullable: true }),
    __metadata("design:type", User_1.User)
], Member.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Member_1, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Member)
], Member.prototype, "parent", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Member_1, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Member)
], Member.prototype, "coach", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Member.prototype, "memberType", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => __1.Address, onDelete: 'set null', nullable: true }),
    __metadata("design:type", __1.Address)
], Member.prototype, "addressHome", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountry_1.ResCountry, onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResCountry_1.ResCountry)
], Member.prototype, "country", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "gender", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "marital", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "spouseCompleteName", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], Member.prototype, "spouseBirthdate", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], Member.prototype, "children", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "placeOfBirth", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountry_1.ResCountry, fieldName: 'country_of_birth', onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResCountry_1.ResCountry)
], Member.prototype, "countryOfBirth", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], Member.prototype, "birthday", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "identificationId", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "passportId", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResPartnerBank_1.ResPartnerBank, onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResPartnerBank_1.ResPartnerBank)
], Member.prototype, "bankAccount", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "permitNo", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "visaNo", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], Member.prototype, "visaExpire", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], Member.prototype, "workPermitExpirationDate", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], Member.prototype, "workPermitScheduledActivity", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "additionalNote", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "certificate", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "studyField", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "studySchool", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "emergencyContact", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Phone_1.Phone, nullable: true }),
    __metadata("design:type", Phone_1.Phone)
], Member.prototype, "emergencyPhone", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "notes", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "departureDescription", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], Member.prototype, "departureDate", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Contract_1.Contract, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Contract_1.Contract)
], Member.prototype, "contract", void 0);
Member = Member_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Unique)({ name: 'hr_member_user_uniq', properties: ['organization', 'user'] }),
    __metadata("design:paramtypes", [])
], Member);
exports.Member = Member;
//# sourceMappingURL=Member.js.map