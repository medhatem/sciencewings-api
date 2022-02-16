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
exports.ResGroupsReportRel = void 0;
const core_1 = require("@mikro-orm/core");
const ResGroups_1 = require("./ResGroups");
const index_1 = require("@di/index");
let ResGroupsReportRel = class ResGroupsReportRel {
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResGroupsReportRel.prototype, "uid", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => ResGroups_1.ResGroups, fieldName: 'gid', onDelete: 'cascade', primary: true }),
    __metadata("design:type", ResGroups_1.ResGroups)
], ResGroupsReportRel.prototype, "gid", void 0);
ResGroupsReportRel = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    (0, core_1.Index)({ name: 'res_groups_report_rel_gid_uid_idx', properties: ['uid', 'gid'] })
], ResGroupsReportRel);
exports.ResGroupsReportRel = ResGroupsReportRel;
//# sourceMappingURL=ResGroupsReportRel.js.map