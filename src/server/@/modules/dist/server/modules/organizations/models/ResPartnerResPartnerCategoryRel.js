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
exports.ResPartnerResPartnerCategoryRel = void 0;
const core_1 = require("@mikro-orm/core");
const ResPartner_1 = require("./ResPartner");
const ResPartnerCategory_1 = require("./ResPartnerCategory");
const index_1 = require("@di/index");
let ResPartnerResPartnerCategoryRel = class ResPartnerResPartnerCategoryRel {
};
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResPartnerCategory_1.ResPartnerCategory, onDelete: 'cascade', primary: true }),
    __metadata("design:type", ResPartnerCategory_1.ResPartnerCategory)
], ResPartnerResPartnerCategoryRel.prototype, "category", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResPartner_1.ResPartner, onDelete: 'cascade', primary: true }),
    __metadata("design:type", ResPartner_1.ResPartner)
], ResPartnerResPartnerCategoryRel.prototype, "partner", void 0);
ResPartnerResPartnerCategoryRel = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Index)({ name: 'res_partner_res_partner_category_rel_partner_id_category_id_idx', properties: ['category', 'partner'] })
], ResPartnerResPartnerCategoryRel);
exports.ResPartnerResPartnerCategoryRel = ResPartnerResPartnerCategoryRel;
//# sourceMappingURL=ResPartnerResPartnerCategoryRel.js.map