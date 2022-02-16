"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
class ServerError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=ServerError.js.map