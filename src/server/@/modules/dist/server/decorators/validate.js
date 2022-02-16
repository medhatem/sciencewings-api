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
exports.validate = void 0;
const validateParam_1 = require("./validateParam");
const Result_1 = require("@utils/Result");
/**
 *
 * Method decorator which validates all the method's parameters
 * that are decorated with @validateParam
 * it uses the schema defined for each param and asynchronously validates it
 *
 * if no validation issues occured continue with the method execution
 * otherwise return a Result failiure with the error message
 *
 * @param target
 * @param propertyKey
 * @param descriptor
 */
function validate(target, propertyKey, descriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parametersToValidate = Reflect.getOwnMetadata(validateParam_1.validateParamMetadataKey, target, propertyKey);
                yield Promise.all(parametersToValidate.map((param) => __awaiter(this, void 0, void 0, function* () {
                    const argumentToValidate = !!args.length && args[param.paramIndex];
                    yield param['schema'].validateAsync(argumentToValidate);
                })));
                return originalFunction.apply(this, args);
            }
            catch (error) {
                return Result_1.Result.fail(error.message);
            }
        });
    };
    return descriptor;
}
exports.validate = validate;
//# sourceMappingURL=validate.js.map