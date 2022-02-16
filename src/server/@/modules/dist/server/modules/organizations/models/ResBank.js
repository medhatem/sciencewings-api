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
var ResBank_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResBank = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const ResCountry_1 = require("@/modules/organizations/models/ResCountry");
const ResCountryState_1 = require("@/modules/organizations/models/ResCountryState");
let ResBank = ResBank_1 = class ResBank extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResBank_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResBank.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResBank.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResBank.prototype, "street", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResBank.prototype, "street2", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResBank.prototype, "zip", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResBank.prototype, "city", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountryState_1.ResCountryState, fieldName: 'state', onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResCountryState_1.ResCountryState)
], ResBank.prototype, "state", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountry_1.ResCountry, fieldName: 'country', onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResCountry_1.ResCountry)
], ResBank.prototype, "country", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResBank.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResBank.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResBank.prototype, "active", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_bank_bic_index' }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResBank.prototype, "bic", void 0);
ResBank = ResBank_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResBank);
exports.ResBank = ResBank;
//# sourceMappingURL=ResBank.js.map