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
var Organization_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = exports.OrganizationType = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const AdressModel_1 = require("@/modules/address/models/AdressModel");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const OrganizationLabel_1 = require("@/modules/organizations/models/OrganizationLabel");
const Phone_1 = require("@/modules/phones/models/Phone");
const User_1 = require("@/modules/users/models/User");
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["PUBLIC"] = "Public";
    OrganizationType["SERVICE"] = "Service";
    OrganizationType["INSTITUT"] = "Institut";
})(OrganizationType = exports.OrganizationType || (exports.OrganizationType = {}));
let Organization = Organization_1 = class Organization extends BaseModel_1.BaseModel {
    constructor() {
        super();
        this.address = new core_1.Collection(this);
        this.labels = new core_1.Collection(this);
        this.members = new core_1.Collection(this);
        this.children = new core_1.Collection(this);
    }
    static getInstance() {
        return index_1.container.get(Organization_1);
    }
};
__decorate([
    (0, core_1.Unique)({ name: 'res_organization_name_uniq' }),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)(),
    (0, core_1.Unique)(),
    __metadata("design:type", String)
], Organization.prototype, "email", void 0);
__decorate([
    (0, core_1.OneToMany)({
        entity: () => Phone_1.Phone,
        mappedBy: (entity) => entity.organization,
    }),
    __metadata("design:type", Phone_1.Phone)
], Organization.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Organization.prototype, "type", void 0);
__decorate([
    (0, core_1.OneToMany)({
        entity: () => AdressModel_1.Address,
        mappedBy: (entity) => entity.organization,
    }),
    __metadata("design:type", Object)
], Organization.prototype, "address", void 0);
__decorate([
    (0, core_1.OneToMany)({
        entity: () => OrganizationLabel_1.OrganizationLabel,
        mappedBy: (entity) => entity.organization,
    }),
    __metadata("design:type", Object)
], Organization.prototype, "labels", void 0);
__decorate([
    (0, core_1.ManyToMany)({ entity: () => User_1.User }),
    __metadata("design:type", Object)
], Organization.prototype, "members", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "socialFacebook", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "socialTwitter", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "socialGithub", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "socialLinkedin", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "socialYoutube", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "socialInstagram", void 0);
__decorate([
    (0, core_1.OneToOne)({
        entity: () => User_1.User,
    }),
    __metadata("design:type", User_1.User)
], Organization.prototype, "direction", void 0);
__decorate([
    (0, core_1.OneToOne)({
        entity: () => User_1.User,
    }),
    __metadata("design:type", User_1.User)
], Organization.prototype, "admin_contact", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Organization_1,
        nullable: true,
    }),
    __metadata("design:type", Organization)
], Organization.prototype, "parent", void 0);
__decorate([
    (0, core_1.OneToMany)({
        entity: () => Organization_1,
        mappedBy: 'parent',
    }),
    __metadata("design:type", Object)
], Organization.prototype, "children", void 0);
Organization = Organization_1 = __decorate([
    (0, index_1.provide)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], Organization);
exports.Organization = Organization;
//# sourceMappingURL=Organization.js.map