"use strict";
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
exports.safeGuard = void 0;
const Result_1 = require("@utils/Result");
/**
 * method decorator that catches any potential errors
 * safe guard the error and return the corresponding Result
 *
 * @param isAsync determines if the decorated method is async
 */
function safeGuard(isAsync = true) {
    return (target, propertyKey, descriptor) => {
        const originalFunction = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (isAsync) {
                        return yield originalFunction.apply(this, args);
                    }
                    return originalFunction.apply(this, args);
                }
                catch (error) {
                    return Result_1.Result.fail(error.message);
                }
            });
        };
        return descriptor;
    };
}
exports.safeGuard = safeGuard;
//# sourceMappingURL=safeGuard.js.map