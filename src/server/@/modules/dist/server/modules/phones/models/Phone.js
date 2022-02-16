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
var Phone_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("@/modules/organizations/models/Organization");
const User_1 = require("@/modules/users/models/User");
// import { ResPartner } from '@/modules/organisations/models/ResPartner';
let Phone = Phone_1 = class Phone extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(Phone_1);
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Phone.prototype, "label", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Phone.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Phone.prototype, "number", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => User_1.User, nullable: true }),
    __metadata("design:type", User_1.User)
], Phone.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Organization_1.Organization, nullable: true }),
    __metadata("design:type", Organization_1.Organization)
], Phone.prototype, "organization", void 0);
Phone = Phone_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], Phone);
exports.Phone = Phone;
//# sourceMappingURL=Phone.js.map