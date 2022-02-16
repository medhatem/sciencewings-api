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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResCountryResCountryGroupRel = void 0;
const core_1 = require("@mikro-orm/core");
const ResCountry_1 = require("./ResCountry");
const ResCountryGroup_1 = require("./ResCountryGroup");
const index_1 = require("@di/index");
let ResCountryResCountryGroupRel = class ResCountryResCountryGroupRel {
};
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountry_1.ResCountry, onDelete: 'cascade', primary: true }),
    __metadata("design:type", ResCountry_1.ResCountry)
], ResCountryResCountryGroupRel.prototype, "resCountry", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResCountryGroup_1.ResCountryGroup, onDelete: 'cascade', primary: true }),
    __metadata("design:type", ResCountryGroup_1.ResCountryGroup)
], ResCountryResCountryGroupRel.prototype, "resCountryGroup", void 0);
ResCountryResCountryGroupRel = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Index)({
        name: 'res_country_res_country_group_res_country_group_id_res_coun_idx',
        properties: ['resCountry', 'resCountryGroup'],
    })
], ResCountryResCountryGroupRel);
exports.ResCountryResCountryGroupRel = ResCountryResCountryGroupRel;
//# sourceMappingURL=ResCountryResCountryGroupRel.js.map