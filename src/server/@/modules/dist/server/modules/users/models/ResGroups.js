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
var ResGroups_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResGroups = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
let ResGroups = ResGroups_1 = class ResGroups extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResGroups_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResGroups.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResGroups.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], ResGroups.prototype, "comment", void 0);
__decorate([
    (0, core_1.Index)({ name: 'res_groups_category_id_index' }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], ResGroups.prototype, "categoryId", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResGroups.prototype, "share", void 0);
ResGroups = ResGroups_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Unique)({ name: 'res_groups_name_uniq', properties: ['name', 'categoryId'] }),
    __metadata("design:paramtypes", [])
], ResGroups);
exports.ResGroups = ResGroups;
//# sourceMappingURL=ResGroups.js.map