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
exports.CreateOrganizationDTO = exports.RegisterUserFromTokenBodyDTO = void 0;
const BaseDTO_1 = require("@/modules/base/dtos/BaseDTO");
const typescript_json_serializer_1 = require("typescript-json-serializer");
let RegisterUserFromTokenBodyDTO = class RegisterUserFromTokenBodyDTO extends BaseDTO_1.BaseBodyDTO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], RegisterUserFromTokenBodyDTO.prototype, "id", void 0);
RegisterUserFromTokenBodyDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], RegisterUserFromTokenBodyDTO);
exports.RegisterUserFromTokenBodyDTO = RegisterUserFromTokenBodyDTO;
let CreateOrganizationDTO = class CreateOrganizationDTO extends BaseDTO_1.BaseRequestDTO {
    constructor() {
        super(...arguments);
        this.body = new RegisterUserFromTokenBodyDTO();
    }
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", RegisterUserFromTokenBodyDTO)
], CreateOrganizationDTO.prototype, "body", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", BaseDTO_1.BaseErrorDTO)
], CreateOrganizationDTO.prototype, "error", void 0);
CreateOrganizationDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], CreateOrganizationDTO);
exports.CreateOrganizationDTO = CreateOrganizationDTO;
//# sourceMappingURL=CreateOrganizationDTO.js.map