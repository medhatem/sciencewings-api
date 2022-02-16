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
var ResCurrency_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResCurrency = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
let ResCurrency = ResCurrency_1 = class ResCurrency extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResCurrency_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResCurrency.prototype, "id", void 0);
__decorate([
    (0, core_1.Unique)({ name: 'res_currency_unique_name' }),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResCurrency.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResCurrency.prototype, "symbol", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResCurrency.prototype, "fullName", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], ResCurrency.prototype, "rounding", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], ResCurrency.prototype, "decimalPlaces", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResCurrency.prototype, "active", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResCurrency.prototype, "position", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResCurrency.prototype, "currencyUnitLabel", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResCurrency.prototype, "currencySubunitLabel", void 0);
ResCurrency = ResCurrency_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResCurrency);
exports.ResCurrency = ResCurrency;
//# sourceMappingURL=ResCurrency.js.map