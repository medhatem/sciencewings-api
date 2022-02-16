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
exports.AddressOrganizationDTO = void 0;
const typescript_json_serializer_1 = require("typescript-json-serializer");
const AdressModel_1 = require("@/modules/address/models/AdressModel");
let AddressOrganizationDTO = class AddressOrganizationDTO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], AddressOrganizationDTO.prototype, "country", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], AddressOrganizationDTO.prototype, "province", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], AddressOrganizationDTO.prototype, "code", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], AddressOrganizationDTO.prototype, "type", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], AddressOrganizationDTO.prototype, "city", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], AddressOrganizationDTO.prototype, "street", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], AddressOrganizationDTO.prototype, "appartement", void 0);
AddressOrganizationDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], AddressOrganizationDTO);
exports.AddressOrganizationDTO = AddressOrganizationDTO;
//# sourceMappingURL=AddressDTO.js.map