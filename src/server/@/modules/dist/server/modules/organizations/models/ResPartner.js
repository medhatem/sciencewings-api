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
var ResPartner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResPartner = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("./Organization");
const ResCountry_1 = require("@/modules/organizations/models/ResCountry");
const ResCountryState_1 = require("@/modules/organizations/models/ResCountryState");
const ResPartnerIndustry_1 = require("@/modules/organizations/models/ResPartnerIndustry");
const ResPartnerTitle_1 = require("@/modules/organizations/models/ResPartnerTitle");
const User_1 = require("@/modules/users/models/User");
let ResPartner = ResPartner_1 = class ResPartner extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResPartner_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResPartner.prototype, "id", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_partner_name_index' }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "name", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Organization_1.Organization,
        onDelete: 'set null',
        nullable: true,
        index: 'res_partner_organization_id_index',
    }),
    __metadata("design:type", Organization_1.Organization)
], ResPartner.prototype, "organization", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_partner_display_name_index' }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "displayName", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_partner_date_index' }),
    (0, core_1.Property)({ columnType: 'date', nullable: true }),
    __metadata("design:type", Date)
], ResPartner.prototype, "date", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResPartnerTitle_1.ResPartnerTitle, fieldName: 'title', onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResPartnerTitle_1.ResPartnerTitle)
], ResPartner.prototype, "title", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResPartner_1, onDelete: 'set null', nullable: true, index: 'res_partner_parent_id_index' }),
    __metadata("design:type", ResPartner)
], ResPartner.prototype, "parent", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_partner_ref_index' }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "ref", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "lang", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "timezone", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => User_1.User, onDelete: 'set null', nullable: true }),
    __metadata("design:type", User_1.User)
], ResPartner.prototype, "user", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_partner_vat_index' }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "vat", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "website", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "comment", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'float8', nullable: true }),
    __metadata("design:type", Number)
], ResPartner.prototype, "creditLimit", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResPartner.prototype, "active", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResPartner.prototype, "member", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "function", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "street", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "street2", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "zip", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "city", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountryState_1.ResCountryState, nullable: true }),
    __metadata("design:type", ResCountryState_1.ResCountryState)
], ResPartner.prototype, "state", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountry_1.ResCountry, nullable: true }),
    __metadata("design:type", ResCountry_1.ResCountry)
], ResPartner.prototype, "country", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], ResPartner.prototype, "partnerLatitude", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], ResPartner.prototype, "partnerLongitude", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "mobile", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResPartner.prototype, "isorganization", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResPartnerIndustry_1.ResPartnerIndustry, onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResPartnerIndustry_1.ResPartnerIndustry)
], ResPartner.prototype, "industry", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResPartner.prototype, "partnerShare", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => ResPartner_1,
        onDelete: 'set null',
        nullable: true,
        index: 'res_partner_commercial_partner_id_index',
    }),
    __metadata("design:type", ResPartner)
], ResPartner.prototype, "commercialPartner", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "commercialorganizationName", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "organizationName", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_partner_message_main_attachment_id_index' }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], ResPartner.prototype, "messageMainAttachmentId", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "emailNormalized", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], ResPartner.prototype, "messageBounce", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "signupToken", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "signupType", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'timestamp', length: 6, nullable: true }),
    __metadata("design:type", Date)
], ResPartner.prototype, "signupExpiration", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], ResPartner.prototype, "partnerGid", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "additionalInfo", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartner.prototype, "phoneSanitized", void 0);
ResPartner = ResPartner_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResPartner);
exports.ResPartner = ResPartner;
//# sourceMappingURL=ResPartner.js.map