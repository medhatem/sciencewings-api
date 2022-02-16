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
var ResCountry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResCountry = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const ResCurrency_1 = require("@/modules/organizations/models/ResCurrency");
let ResCountry = ResCountry_1 = class ResCountry extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResCountry_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResCountry.prototype, "id", void 0);
__decorate([
    (0, core_1.Unique)({ name: 'res_country_name_uniq' }),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResCountry.prototype, "name", void 0);
__decorate([
    (0, core_1.Unique)({ name: 'res_country_code_uniq' }),
    (0, core_1.Property)({ length: 2, nullable: true }),
    __metadata("design:type", String)
], ResCountry.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], ResCountry.prototype, "addressFormat", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], ResCountry.prototype, "addressViewId", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCurrency_1.ResCurrency, onDelete: 'set null', nullable: true }),
    __metadata("design:type", ResCurrency_1.ResCurrency)
], ResCountry.prototype, "currency", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], ResCountry.prototype, "phoneCode", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResCountry.prototype, "namePosition", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResCountry.prototype, "vatLabel", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResCountry.prototype, "stateRequired", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResCountry.prototype, "zipRequired", void 0);
ResCountry = ResCountry_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResCountry);
exports.ResCountry = ResCountry;
//# sourceMappingURL=ResCountry.js.map