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
var ResCountryGroup_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResCountryGroup = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
let ResCountryGroup = ResCountryGroup_1 = class ResCountryGroup extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResCountryGroup_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResCountryGroup.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ResCountryGroup.prototype, "name", void 0);
ResCountryGroup = ResCountryGroup_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResCountryGroup);
exports.ResCountryGroup = ResCountryGroup;
//# sourceMappingURL=ResCountryGroup.js.map