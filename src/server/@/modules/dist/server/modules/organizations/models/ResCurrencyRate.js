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
var ResCurrencyRate_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResCurrencyRate = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("./Organization");
const ResCurrency_1 = require("@/modules/organizations/models/ResCurrency");
let ResCurrencyRate = ResCurrencyRate_1 = class ResCurrencyRate extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResCurrencyRate_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResCurrencyRate.prototype, "id", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_currency_rate_name_index' }),
    (0, core_1.Property)({ columnType: 'date' }),
    __metadata("design:type", Date)
], ResCurrencyRate.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], ResCurrencyRate.prototype, "rate", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => ResCurrency_1.ResCurrency, onDelete: 'cascade' }),
    __metadata("design:type", ResCurrency_1.ResCurrency)
], ResCurrencyRate.prototype, "currency", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Organization_1.Organization, onDelete: 'set null', nullable: true }),
    __metadata("design:type", Organization_1.Organization)
], ResCurrencyRate.prototype, "organization", void 0);
ResCurrencyRate = ResCurrencyRate_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Unique)({ name: 'res_currency_rate_unique_name_per_day', properties: ['name', 'currency', 'organization'] }),
    __metadata("design:paramtypes", [])
], ResCurrencyRate);
exports.ResCurrencyRate = ResCurrencyRate;
//# sourceMappingURL=ResCurrencyRate.js.map