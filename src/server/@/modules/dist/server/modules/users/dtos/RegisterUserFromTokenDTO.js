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
exports.ResetPasswordDTO = exports.RegisterUserFromTokenDTO = exports.ErrorDTO = exports.ResetDTO = exports.UserIdDTO = void 0;
const BaseDTO_1 = require("@/modules/base/dtos/BaseDTO");
const typescript_json_serializer_1 = require("typescript-json-serializer");
let UserIdDTO = class UserIdDTO extends BaseDTO_1.BaseBodyDTO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], UserIdDTO.prototype, "userId", void 0);
UserIdDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], UserIdDTO);
exports.UserIdDTO = UserIdDTO;
let ResetDTO = class ResetDTO extends BaseDTO_1.BaseBodyDTO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], ResetDTO.prototype, "message", void 0);
ResetDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], ResetDTO);
exports.ResetDTO = ResetDTO;
let ErrorDTO = class ErrorDTO extends BaseDTO_1.BaseErrorDTO {
};
ErrorDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], ErrorDTO);
exports.ErrorDTO = ErrorDTO;
let RegisterUserFromTokenDTO = class RegisterUserFromTokenDTO extends BaseDTO_1.BaseRequestDTO {
    constructor() {
        super(...arguments);
        this.body = new UserIdDTO();
        this.error = new ErrorDTO();
    }
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", UserIdDTO)
], RegisterUserFromTokenDTO.prototype, "body", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", BaseDTO_1.BaseErrorDTO)
], RegisterUserFromTokenDTO.prototype, "error", void 0);
RegisterUserFromTokenDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], RegisterUserFromTokenDTO);
exports.RegisterUserFromTokenDTO = RegisterUserFromTokenDTO;
let ResetPasswordDTO = class ResetPasswordDTO extends BaseDTO_1.BaseRequestDTO {
    constructor() {
        super(...arguments);
        this.body = new ResetDTO();
        this.error = new ErrorDTO();
    }
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", ResetDTO)
], ResetPasswordDTO.prototype, "body", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", BaseDTO_1.BaseErrorDTO)
], ResetPasswordDTO.prototype, "error", void 0);
ResetPasswordDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], ResetPasswordDTO);
exports.ResetPasswordDTO = ResetPasswordDTO;
//# sourceMappingURL=RegisterUserFromTokenDTO.js.map