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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("@/modules/organizations/models/Organization");
const Phone_1 = require("@/modules/phones/models/Phone");
let User = User_1 = class User extends BaseModel_1.BaseModel {
    constructor() {
        super();
        this.phone = new core_1.Collection(this);
        this.dateofbirth = new Date();
        // @ManyToOne({ entity: () => Organisation })
        // @ManyToMany(() => Organisation, 'users', { owner: true })
        this.organizations = new core_1.Collection(this);
    }
    static getInstance() {
        return index_1.container.get(User_1);
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "firstname", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "lastname", void 0);
__decorate([
    (0, core_1.Property)(),
    (0, core_1.Unique)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, core_1.OneToMany)({
        entity: () => Phone_1.Phone,
        mappedBy: (entity) => entity.user,
        nullable: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateType, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "dateofbirth", void 0);
__decorate([
    (0, core_1.Property)(),
    (0, core_1.Index)(),
    __metadata("design:type", String)
], User.prototype, "keycloakId", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => Organization_1.Organization, (organization) => organization.members),
    __metadata("design:type", Object)
], User.prototype, "organizations", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "signature", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "actionId", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "share", void 0);
User = User_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], User);
exports.User = User;
//# sourceMappingURL=User.js.map