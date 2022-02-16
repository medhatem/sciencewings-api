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
exports.UserDTO = void 0;
const BaseDTO_1 = require("@/modules/base/dtos/BaseDTO");
const typescript_json_serializer_1 = require("typescript-json-serializer");
class BaseBodyGetDTO extends BaseDTO_1.BaseBodyDTO {
}
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], BaseBodyGetDTO.prototype, "id", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], BaseBodyGetDTO.prototype, "firstname", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], BaseBodyGetDTO.prototype, "lastname", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], BaseBodyGetDTO.prototype, "email", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Array)
], BaseBodyGetDTO.prototype, "phones", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], BaseBodyGetDTO.prototype, "keycloakId", void 0);
let UserDTO = class UserDTO extends BaseDTO_1.BaseRequestDTO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", BaseBodyGetDTO)
], UserDTO.prototype, "body", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", BaseDTO_1.BaseErrorDTO)
], UserDTO.prototype, "error", void 0);
UserDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], UserDTO);
exports.UserDTO = UserDTO;
//# sourceMappingURL=UserDTO.js.map