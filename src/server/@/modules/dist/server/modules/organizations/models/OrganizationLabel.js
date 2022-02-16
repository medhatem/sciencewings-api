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
var OrganizationLabel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationLabel = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("@/modules/organizations/models/Organization");
let OrganizationLabel = OrganizationLabel_1 = class OrganizationLabel extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(OrganizationLabel_1);
    }
};
__decorate([
    (0, core_1.Unique)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], OrganizationLabel.prototype, "name", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Organization_1.Organization,
        onDelete: 'cascade',
        nullable: true,
    }),
    __metadata("design:type", Organization_1.Organization)
], OrganizationLabel.prototype, "organization", void 0);
OrganizationLabel = OrganizationLabel_1 = __decorate([
    (0, index_1.provide)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], OrganizationLabel);
exports.OrganizationLabel = OrganizationLabel;
//# sourceMappingURL=OrganizationLabel.js.map