"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LocalStorage_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const index_1 = require("@di/index");
const async_hooks_1 = require("async_hooks");
/**
 * Class used mainly to create a storage
 * the storage will keep the state of the routes
 * it will contain a unique id which will be useful
 * for the logger when tracing back the logs
 */
let LocalStorage = LocalStorage_1 = class LocalStorage extends async_hooks_1.AsyncLocalStorage {
    static getInstance() {
        return index_1.container.get(LocalStorage_1);
    }
};
LocalStorage = LocalStorage_1 = __decorate([
    (0, index_1.provideSingleton)()
], LocalStorage);
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map