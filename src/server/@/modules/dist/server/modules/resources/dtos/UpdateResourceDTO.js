"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateResourceDTO = void 0;
const BaseDTO_1 = require("@/modules/base/dtos/BaseDTO");
const typescript_json_serializer_1 = require("typescript-json-serializer");
let UpdateResourceDTO = class UpdateResourceDTO extends BaseDTO_1.BaseRequestDTO {
};
UpdateResourceDTO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], UpdateResourceDTO);
exports.UpdateResourceDTO = UpdateResourceDTO;
//# sourceMappingURL=UpdateResourceDTO.js.map