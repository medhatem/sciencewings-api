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
var ResConfigSettings_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResConfigSettings = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
const BaseModel_1 = require("@/modules/base/models/BaseModel");
const Organization_1 = require("./Organization");
let ResConfigSettings = ResConfigSettings_1 = class ResConfigSettings extends BaseModel_1.BaseModel {
    constructor() {
        super();
    }
    static getInstance() {
        return index_1.container.get(ResConfigSettings_1);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ResConfigSettings.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Organization_1.Organization, onDelete: 'cascade' }),
    __metadata("design:type", Organization_1.Organization)
], ResConfigSettings.prototype, "organization", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "userDefaultRights", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "externalEmailServerDefault", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "moduleGoogleCalendar", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "moduleMicrosoftCalendar", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "moduleAccountInterorganizationRules", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "moduleHrPresence", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "moduleHrSkills", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "hrPresenceControlLogin", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "hrPresenceControlEmail", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "hrPresenceControlIp", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "moduleHrAttendance", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], ResConfigSettings.prototype, "hrMemberSelfEdit", void 0);
ResConfigSettings = ResConfigSettings_1 = __decorate([
    (0, index_1.provideSingleton)(),
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [])
], ResConfigSettings);
exports.ResConfigSettings = ResConfigSettings;
//# sourceMappingURL=ResConfigSettings.js.map