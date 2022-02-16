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
exports.CreatedUserDTO = void 0;
const RegisterUserFromTokenDTO_1 = require("@/modules/users/dtos/RegisterUserFromTokenDTO");
const typescript_json_serializer_1 = require("typescript-json-serializer");
const BaseDTO_1 = require("@/modules/base/dtos/BaseDTO");
const BaseDTO_2 = require("@/modules/base/dtos/BaseDTO");
let CreatedUserDTO = class CreatedUserDTO extends BaseDTO_2.BaseRequestDTO {
    constructor() {
        super(...arguments);
        this.body = new RegisterUserFromTokenDTO_1.UserIdDTO();
        this.error = new RegisterUserFromTokenDTO_1.ErrorDTO();
    }
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", RegisterUserFromTokenDTO_1.UserIdDTO)
], CreatedUserDTO.prototype, "body", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", BaseDTO_1.BaseErrorDTO)
], CreatedUserDTO.prototype, "error", void 0);
CreatedUserDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], CreatedUserDTO);
exports.CreatedUserDTO = CreatedUserDTO;
//# sourceMappingURL=CreatedUserDTO.js.map