"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
require("module-alias/register");
const Configuration_1 = require("./configuration/Configuration");
const Server_1 = require("./Server");
const di_1 = require("./di");
__exportStar(require("./modules/users"), exports);
__exportStar(require("./modules/base"), exports);
__exportStar(require("./modules/hr"), exports);
__exportStar(require("./modules/organizations"), exports);
__exportStar(require("./modules/resources"), exports);
__exportStar(require("./modules/address"), exports);
__exportStar(require("./modules/phones"), exports);
di_1.container.initialize();
// istanbul ignore next
if (process.argv[1].includes('dist/server/index.js')) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const server = new Server_1.Server(di_1.container.get(Configuration_1.Configuration));
        yield server.startApp();
    }))();
}
//# sourceMappingURL=index.js.map