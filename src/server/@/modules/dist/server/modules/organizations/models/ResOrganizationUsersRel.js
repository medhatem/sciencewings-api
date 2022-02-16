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
exports.OrganizationUsersRel = void 0;
const core_1 = require("@mikro-orm/core");
const Organization_1 = require("./Organization");
const User_1 = require("@/modules/users/models/User");
const index_1 = require("@di/index");
let OrganizationUsersRel = class OrganizationUsersRel {
};
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Organization_1.Organization, fieldName: 'cid', onDelete: 'cascade', primary: true }),
    __metadata("design:type", Organization_1.Organization)
], OrganizationUsersRel.prototype, "cid", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => User_1.User, onDelete: 'cascade', primary: true }),
    __metadata("design:type", User_1.User)
], OrganizationUsersRel.prototype, "user", void 0);
OrganizationUsersRel = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Index)({ name: 'res_organization_users_rel_user_id_cid_idx', properties: ['cid', 'user'] })
], OrganizationUsersRel);
exports.OrganizationUsersRel = OrganizationUsersRel;
//# sourceMappingURL=ResOrganizationUsersRel.js.map