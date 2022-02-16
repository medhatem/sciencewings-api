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
exports.MemberCategoryRel = void 0;
const core_1 = require("@mikro-orm/core");
const Member_1 = require("./Member");
const MemberCategory_1 = require("./MemberCategory");
const index_1 = require("@di/index");
let MemberCategoryRel = class MemberCategoryRel {
};
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Member_1.Member, onDelete: 'cascade', primary: true }),
    __metadata("design:type", Member_1.Member)
], MemberCategoryRel.prototype, "emp", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => MemberCategory_1.MemberCategory, onDelete: 'cascade', primary: true }),
    __metadata("design:type", MemberCategory_1.MemberCategory)
], MemberCategoryRel.prototype, "category", void 0);
MemberCategoryRel = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Index)({ name: 'member_category_rel_category_id_emp_id_idx', properties: ['emp', 'category'] })
], MemberCategoryRel);
exports.MemberCategoryRel = MemberCategoryRel;
//# sourceMappingURL=MemberCategoryRel.js.map