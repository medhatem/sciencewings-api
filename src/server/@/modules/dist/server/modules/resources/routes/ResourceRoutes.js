'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var ResourceRoutes_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.ResourceRoutes = void 0;
const index_1 = require('@di/index');
const BaseRoutes_1 = require('@/modules/base/routes/BaseRoutes');
const typescript_rest_1 = require('typescript-rest');
const RequestObject_1 = require('./RequestObject');
const interfaces_1 = require('../interfaces');
const constants_1 = require('./@/modules/authenticators/constants');
const loggerStorage_1 = require('@/decorators/loggerStorage');
const ResourceDTO_1 = require('@/modules/resources/dtos/ResourceDTO');
const UpdateResourceDTO_1 = require('@/modules/resources/dtos/UpdateResourceDTO');
const CreatedResourceDTO_1 = require('@/modules/resources/dtos/CreatedResourceDTO');
let ResourceRoutes = (ResourceRoutes_1 = class ResourceRoutes extends BaseRoutes_1.BaseRoutes {
  constructor(ResourceService) {
    super(ResourceService, new ResourceDTO_1.ResourceDTO(), new UpdateResourceDTO_1.UpdateResourceDTO());
    this.ResourceService = ResourceService;
    console.log(this.ResourceService);
  }
  static getInstance() {
    return index_1.container.get(ResourceRoutes_1);
  }
  /**
   * Registers a new resource in the database
   *
   * @param payload
   * Should container Resource data that include Resource data
   */
  createResource(payload) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.ResourceService.createResource(payload);
      if (result.isFailure) {
        return new CreatedResourceDTO_1.CreateResourceDTO().serialize({
          error: { statusCode: 500, errorMessage: result.error },
        });
      }
      return new CreatedResourceDTO_1.CreateResourceDTO().serialize({
        body: { resourceId: result.getValue(), statusCode: 201 },
      });
    });
  }
  updateResource(payload, id) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.ResourceService.updateResource(payload, id);
      if (result.isFailure) {
        return new CreatedResourceDTO_1.CreateResourceDTO().serialize({
          error: { statusCode: 500, errorMessage: result.error },
        });
      }
      return new CreatedResourceDTO_1.CreateResourceDTO().serialize({
        body: { resourceId: result.getValue(), statusCode: 201 },
      });
    });
  }
});
__decorate(
  [
    typescript_rest_1.POST,
    (0, typescript_rest_1.Path)('create'),
    (0, typescript_rest_1.Security)('', constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [RequestObject_1.CreateResourceRO]),
    __metadata('design:returntype', Promise),
  ],
  ResourceRoutes.prototype,
  'createResource',
  null,
);
__decorate(
  [
    typescript_rest_1.PUT,
    (0, typescript_rest_1.Path)('update/:id'),
    (0, typescript_rest_1.Security)('', constants_1.KEYCLOAK_TOKEN),
    (0, loggerStorage_1.LoggerStorage)(),
    __param(1, (0, typescript_rest_1.PathParam)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [RequestObject_1.CreateResourceRO, Number]),
    __metadata('design:returntype', Promise),
  ],
  ResourceRoutes.prototype,
  'updateResource',
  null,
);
ResourceRoutes = ResourceRoutes_1 = __decorate(
  [
    (0, index_1.provideSingleton)(),
    (0, typescript_rest_1.Path)('resources'),
    __metadata('design:paramtypes', [interfaces_1.IResourceService]),
  ],
  ResourceRoutes,
);
exports.ResourceRoutes = ResourceRoutes;
//# sourceMappingURL=ResourceRoutes.js.map
