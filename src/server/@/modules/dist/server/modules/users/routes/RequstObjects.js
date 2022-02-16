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
exports.ResetPasswordRO = exports.UserDetailsRO = exports.UserInviteToOrgRO = void 0;
const typescript_json_serializer_1 = require("typescript-json-serializer");
class UserInviteToOrgRO {
}
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], UserInviteToOrgRO.prototype, "organizationId", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UserInviteToOrgRO.prototype, "email", void 0);
exports.UserInviteToOrgRO = UserInviteToOrgRO;
let UserDetailsRO = class UserDetailsRO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UserDetailsRO.prototype, "email", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UserDetailsRO.prototype, "firstname", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UserDetailsRO.prototype, "lastname", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UserDetailsRO.prototype, "address", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Array)
], UserDetailsRO.prototype, "phones", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], UserDetailsRO.prototype, "dateofbirth", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UserDetailsRO.prototype, "signature", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], UserDetailsRO.prototype, "actionId", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Boolean)
], UserDetailsRO.prototype, "share", void 0);
UserDetailsRO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], UserDetailsRO);
exports.UserDetailsRO = UserDetailsRO;
class ResetPasswordRO {
}
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], ResetPasswordRO.prototype, "email", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], ResetPasswordRO.prototype, "password", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], ResetPasswordRO.prototype, "passwordConfirmation", void 0);
exports.ResetPasswordRO = ResetPasswordRO;
//# sourceMappingURL=RequstObjects.js.map