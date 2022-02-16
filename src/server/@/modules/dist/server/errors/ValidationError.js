"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatonError = void 0;
class ValidatonError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
exports.ValidatonError = ValidatonError;
//# sourceMappingURL=ValidationError.js.map