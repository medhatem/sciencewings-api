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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRoutes = void 0;
const BaseService_1 = require("@/modules/base/services/BaseService");
const index_1 = require("@di/index");
const typescript_rest_1 = require("typescript-rest");
const typescript_rest_swagger_1 = require("typescript-rest-swagger");
const BaseDTO_1 = require("../dtos/BaseDTO");
const Logger_1 = require("@utils/Logger");
const constants_1 = require("@/modules/../authenticators/constants");
let BaseRoutes = class BaseRoutes {
    constructor(service, baseGetDTO, baseUpdateDTO) {
        this.service = service;
        this.baseGetDTO = baseGetDTO;
        this.baseUpdateDTO = baseUpdateDTO;
        this.getDTOMapper = this.baseGetDTO;
        this.updateDTOMapper = this.baseUpdateDTO;
        this.logger = Logger_1.Logger.getInstance();
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.service.get(id);
            if (result.isFailure) {
                return this.getDTOMapper.serialize({
                    error: { statusCode: 500, message: result.error },
                });
            }
            return this.getDTOMapper.serialize({
                body: Object.assign({ statusCode: 204 }, result.getValue()),
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.service.getAll();
            if (result.isFailure) {
                return this.getDTOMapper.serialize({
                    error: { statusCode: 500, message: result.error },
                });
            }
            return this.getDTOMapper.serialize({
                body: { statusCode: 204, enities: result.getValue() },
            });
        });
    }
    update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentEntity = yield this.service.get(id);
            if (currentEntity.isFailure || (yield currentEntity.getValue()) === null) {
                return this.updateDTOMapper.serialize({
                    error: { statusCode: 404, message: `Entity with id ${id} does not exist` },
                });
            }
            const entity = Object.assign(Object.assign({}, currentEntity.getValue()), payload);
            const result = yield this.service.update(entity);
            if (result.isFailure) {
                return this.updateDTOMapper.serialize({
                    error: { statusCode: 500, message: result.error },
                });
            }
            return this.updateDTOMapper.serialize({
                body: { statusCode: 204, entityId: result.getValue() },
            });
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentEntity = yield this.service.get(id);
            if (currentEntity.isFailure || currentEntity.getValue() === null) {
                return new BaseDTO_1.BaseRequestDTO().serialize({
                    error: { statusCode: 404, userId: `Entity with id ${id} does not exist` },
                });
            }
            const result = yield this.service.remove(id);
            if (result.isFailure) {
                return new BaseDTO_1.BaseRequestDTO().serialize({
                    error: { statusCode: 500, error: result.error },
                });
            }
            return new BaseDTO_1.BaseRequestDTO().serialize({
                body: { statusCode: 204, entityId: result.getValue() },
            });
        });
    }
};
__decorate([
    typescript_rest_1.GET,
    (0, typescript_rest_1.Path)('/getById/:id'),
    (0, typescript_rest_1.Security)([], constants_1.KEYCLOAK_TOKEN),
    (0, typescript_rest_swagger_1.Response)(200, 'success'),
    __param(0, (0, typescript_rest_1.PathParam)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BaseRoutes.prototype, "getById", null);
__decorate([
    typescript_rest_1.GET,
    (0, typescript_rest_1.Path)('/getAll'),
    (0, typescript_rest_1.Security)([], constants_1.KEYCLOAK_TOKEN),
    (0, typescript_rest_swagger_1.Response)(200, 'success'),
    (0, typescript_rest_swagger_1.Response)(401, 'error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseRoutes.prototype, "getAll", null);
__decorate([
    typescript_rest_1.PUT,
    (0, typescript_rest_1.Path)('/:id'),
    (0, typescript_rest_1.Security)([], constants_1.KEYCLOAK_TOKEN),
    (0, typescript_rest_swagger_1.Response)(204, 'success'),
    __param(0, (0, typescript_rest_1.PathParam)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BaseRoutes.prototype, "update", null);
__decorate([
    typescript_rest_1.DELETE,
    (0, typescript_rest_1.Path)('/:id'),
    (0, typescript_rest_1.Security)([], constants_1.KEYCLOAK_TOKEN),
    (0, typescript_rest_swagger_1.Response)(201, 'success'),
    __param(0, (0, typescript_rest_1.PathParam)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BaseRoutes.prototype, "remove", null);
BaseRoutes = __decorate([
    (0, index_1.provideSingleton)(),
    __metadata("design:paramtypes", [BaseService_1.BaseService,
        BaseDTO_1.BaseRequestDTO,
        BaseDTO_1.BaseRequestDTO])
], BaseRoutes);
exports.BaseRoutes = BaseRoutes;
//# sourceMappingURL=BaseRoutes.js.map