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
var ResourceCalendarDao_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceCalendarDao = void 0;
const index_1 = require("@di/index");
const BaseDao_1 = require("@/modules/base/daos/BaseDao");
const ResourceCalendar_1 = require("./../models/ResourceCalendar");
let ResourceCalendarDao = ResourceCalendarDao_1 = class ResourceCalendarDao extends BaseDao_1.BaseDao {
    constructor(model) {
        super(model);
        this.model = model;
    }
    static getInstance() {
        return index_1.container.get(ResourceCalendarDao_1);
    }
};
ResourceCalendarDao = ResourceCalendarDao_1 = __decorate([
    (0, index_1.provideSingleton)(),
    __metadata("design:paramtypes", [ResourceCalendar_1.ResourceCalendar])
], ResourceCalendarDao);
exports.ResourceCalendarDao = ResourceCalendarDao;
//# sourceMappingURL=ResourceCalendarDAO.js.map