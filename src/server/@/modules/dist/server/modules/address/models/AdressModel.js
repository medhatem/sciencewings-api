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
var Address_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = exports.AddressType = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("@/modules/organizations/models/Organization");
var AddressType;
(function (AddressType) {
    AddressType["USER"] = "USER";
    AddressType["ORGANIZATION"] = "ORGANIZATION";
})(AddressType = exports.AddressType || (exports.AddressType = {}));
let Address = Address_1 = class Address extends BaseModel_1.BaseModel {
    static getInstance() {
        index_1.container.get(Address_1);
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Address.prototype, "province", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Address.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Address.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Address.prototype, "street", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Address.prototype, "appartement", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Organization_1.Organization,
        onDelete: 'cascade',
        nullable: true,
    }),
    __metadata("design:type", Organization_1.Organization)
], Address.prototype, "organization", void 0);
Address = Address_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)()
], Address);
exports.Address = Address;
//# sourceMappingURL=AdressModel.js.map