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
exports.BaseModel = void 0;
const core_1 = require("@mikro-orm/core");
const index_1 = require("@di/index");
let BaseModel = class BaseModel {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    static getInstance() {
        throw new Error('The base model class cannot be instanciated and needs to be overriden!');
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], BaseModel.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'timestamp', length: 6, nullable: true, onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], BaseModel.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'timestamp', length: 6, nullable: true, onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], BaseModel.prototype, "updatedAt", void 0);
BaseModel = __decorate([
    (0, index_1.provideSingleton)()
], BaseModel);
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.js.map