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
var AddressDao_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressDao = void 0;
const index_1 = require("@di/index");
const AdressModel_1 = require("@/modules/address/models/AdressModel");
const BaseDao_1 = require("@/modules/base/daos/BaseDao");
let AddressDao = AddressDao_1 = class AddressDao extends BaseDao_1.BaseDao {
    constructor(model) {
        super(model);
        this.model = model;
    }
    static getInstance() {
        return index_1.container.get(AddressDao_1);
    }
};
AddressDao = AddressDao_1 = __decorate([
    (0, index_1.provideSingleton)(),
    __metadata("design:paramtypes", [AdressModel_1.Address])
], AddressDao);
exports.AddressDao = AddressDao;
//# sourceMappingURL=AddressDAO.js.map