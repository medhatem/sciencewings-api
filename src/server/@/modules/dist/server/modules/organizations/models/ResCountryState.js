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
var ResCountryState_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResCountryState = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const ResCountry_1 = require("@/modules/organizations/models/ResCountry");
let ResCountryState = ResCountryState_1 = class ResCountryState extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResCountryState_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResCountryState.prototype, "id", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => ResCountry_1.ResCountry }),
    __metadata("design:type", ResCountry_1.ResCountry)
], ResCountryState.prototype, "country", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResCountryState.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResCountryState.prototype, "code", void 0);
ResCountryState = ResCountryState_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Unique)({ name: 'res_country_state_name_code_uniq', properties: ['country', 'code'] }),
    __metadata("design:paramtypes", [])
], ResCountryState);
exports.ResCountryState = ResCountryState;
//# sourceMappingURL=ResCountryState.js.map