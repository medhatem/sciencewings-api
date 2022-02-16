"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthorized = void 0;
class Unauthorized extends Error {
    constructor(message = 'Not Authorized', status = 403) {
        super(message);
        this.message = message;
        this.status = status;
    }
}
exports.Unauthorized = Unauthorized;
//# sourceMappingURL=Unauthorized.js.map