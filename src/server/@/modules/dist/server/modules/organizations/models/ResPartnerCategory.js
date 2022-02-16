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
var ResPartnerCategory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResPartnerCategory = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
let ResPartnerCategory = ResPartnerCategory_1 = class ResPartnerCategory extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResPartnerCategory_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResPartnerCategory.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResPartnerCategory.prototype, "name", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => ResPartnerCategory_1,
        onDelete: 'cascade',
        nullable: true,
        index: 'res_partner_category_parent_id_index',
    }),
    __metadata("design:type", ResPartnerCategory)
], ResPartnerCategory.prototype, "parent", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResPartnerCategory.prototype, "active", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_partner_category_parent_path_index' }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], ResPartnerCategory.prototype, "parentPath", void 0);
ResPartnerCategory = ResPartnerCategory_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResPartnerCategory);
exports.ResPartnerCategory = ResPartnerCategory;
//# sourceMappingURL=ResPartnerCategory.js.map