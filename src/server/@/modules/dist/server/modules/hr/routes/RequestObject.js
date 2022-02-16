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
exports.UpdateMemberRO = exports.CreateMemberRO = void 0;
const __1 = require("@/modules/..");
const typescript_json_serializer_1 = require("typescript-json-serializer");
let CreateMemberRO = class CreateMemberRO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateMemberRO.prototype, "id", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateMemberRO.prototype, "resource", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateMemberRO.prototype, "organization", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "name", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Boolean)
], CreateMemberRO.prototype, "active", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "jobTitle", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Address)
], CreateMemberRO.prototype, "address", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Phone)
], CreateMemberRO.prototype, "workPhone", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Phone)
], CreateMemberRO.prototype, "mobilePhone", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "workEmail", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Address)
], CreateMemberRO.prototype, "workLocation", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "memberType", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Address)
], CreateMemberRO.prototype, "addressHome", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "gender", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "marital", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "spouseCompleteName", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], CreateMemberRO.prototype, "spouseBirthdate", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateMemberRO.prototype, "children", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "placeOfBirth", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], CreateMemberRO.prototype, "birthday", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "identificationId", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "passportId", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "permitNo", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "visaNo", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], CreateMemberRO.prototype, "visaExpire", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], CreateMemberRO.prototype, "workPermitExpirationDate", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Boolean)
], CreateMemberRO.prototype, "workPermitScheduledActivity", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "additionalNote", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "certificate", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "studyField", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "studySchool", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "emergencyContact", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Phone)
], CreateMemberRO.prototype, "emergencyPhone", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "notes", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateMemberRO.prototype, "departureDescription", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], CreateMemberRO.prototype, "departureDate", void 0);
CreateMemberRO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], CreateMemberRO);
exports.CreateMemberRO = CreateMemberRO;
let UpdateMemberRO = class UpdateMemberRO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], UpdateMemberRO.prototype, "id", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], UpdateMemberRO.prototype, "resource", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], UpdateMemberRO.prototype, "organization", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "name", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Boolean)
], UpdateMemberRO.prototype, "active", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "jobTitle", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Address)
], UpdateMemberRO.prototype, "address", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Phone)
], UpdateMemberRO.prototype, "workPhone", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Phone)
], UpdateMemberRO.prototype, "mobilePhone", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "workEmail", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Address)
], UpdateMemberRO.prototype, "workLocation", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "memberType", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Address)
], UpdateMemberRO.prototype, "addressHome", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "gender", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "marital", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "spouseCompleteName", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], UpdateMemberRO.prototype, "spouseBirthdate", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], UpdateMemberRO.prototype, "children", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "placeOfBirth", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], UpdateMemberRO.prototype, "birthday", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "identificationId", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "passportId", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "permitNo", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "visaNo", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], UpdateMemberRO.prototype, "visaExpire", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], UpdateMemberRO.prototype, "workPermitExpirationDate", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Boolean)
], UpdateMemberRO.prototype, "workPermitScheduledActivity", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "additionalNote", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "certificate", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "studyField", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "studySchool", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "emergencyContact", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", __1.Phone)
], UpdateMemberRO.prototype, "emergencyPhone", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "notes", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], UpdateMemberRO.prototype, "departureDescription", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Date)
], UpdateMemberRO.prototype, "departureDate", void 0);
UpdateMemberRO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], UpdateMemberRO);
exports.UpdateMemberRO = UpdateMemberRO;
//# sourceMappingURL=RequestObject.js.map