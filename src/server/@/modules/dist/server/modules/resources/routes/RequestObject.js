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
exports.CreateResourceRO = exports.CreateResourceCalendarRO = void 0;
const typescript_json_serializer_1 = require("typescript-json-serializer");
let CreateResourceCalendarRO = class CreateResourceCalendarRO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateResourceCalendarRO.prototype, "name", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Boolean)
], CreateResourceCalendarRO.prototype, "active", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateResourceCalendarRO.prototype, "organization", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateResourceCalendarRO.prototype, "hoursPerDay", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateResourceCalendarRO.prototype, "timezone", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Boolean)
], CreateResourceCalendarRO.prototype, "twoWeeksCalendar", void 0);
CreateResourceCalendarRO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], CreateResourceCalendarRO);
exports.CreateResourceCalendarRO = CreateResourceCalendarRO;
let CreateResourceRO = class CreateResourceRO {
};
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateResourceRO.prototype, "name", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Boolean)
], CreateResourceRO.prototype, "active", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateResourceRO.prototype, "organization", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateResourceRO.prototype, "resourceType", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateResourceRO.prototype, "user", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", Number)
], CreateResourceRO.prototype, "timeEfficiency", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", String)
], CreateResourceRO.prototype, "timezone", void 0);
__decorate([
    (0, typescript_json_serializer_1.JsonProperty)(),
    __metadata("design:type", CreateResourceCalendarRO)
], CreateResourceRO.prototype, "calendar", void 0);
CreateResourceRO = __decorate([
    (0, typescript_json_serializer_1.Serializable)()
], CreateResourceRO);
exports.CreateResourceRO = CreateResourceRO;
//# sourceMappingURL=RequestObject.js.map