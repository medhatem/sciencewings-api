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
exports.UserInviteToOrgRO = exports.CreateOrganizationRO = void 0;
const typescript_json_serializer_1 = require("typescript-json-serializer");
let CreateOrganizationRO = class CreateOrganizationRO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "name", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "email", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Array)
], CreateOrganizationRO.prototype, "phones", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "type", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Array)
], CreateOrganizationRO.prototype, "address", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Array)
], CreateOrganizationRO.prototype, "labels", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Array)
], CreateOrganizationRO.prototype, "members", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateOrganizationRO.prototype, "direction", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "social_facebook", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "social_twitter", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "social_github", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "social_linkedin", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "social_youtube", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "social_instagram", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateOrganizationRO.prototype, "adminContact", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateOrganizationRO.prototype, "parentId", void 0);
CreateOrganizationRO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], CreateOrganizationRO);
exports.CreateOrganizationRO = CreateOrganizationRO;
let UserInviteToOrgRO = class UserInviteToOrgRO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], UserInviteToOrgRO.prototype, "organizationId", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UserInviteToOrgRO.prototype, "email", void 0);
UserInviteToOrgRO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], UserInviteToOrgRO);
exports.UserInviteToOrgRO = UserInviteToOrgRO;
//# sourceMappingURL=RequestObject.js.map