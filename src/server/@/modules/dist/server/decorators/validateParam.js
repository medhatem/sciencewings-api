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
exports.validateParam = exports.validateParamMetadataKey = void 0;
require("reflect-metadata");
exports.validateParamMetadataKey = Symbol('validateParam');
/**
 * Parameter decorator which takes a Joi schema as a validator
 * declares that the decorator parameter needs to be validated
 * against the defined schema
 *
 * @param schema the Joi schema to validate against
 */
function validateParam(schema) {
    return (target, propertyKey, parameterIndex) => __awaiter(this, void 0, void 0, function* () {
        const existingParamsToValidate = Reflect.getOwnMetadata(exports.validateParamMetadataKey, target, propertyKey) || [];
        existingParamsToValidate.push({
            paramIndex: parameterIndex,
            schema,
        });
        Reflect.defineMetadata(exports.validateParamMetadataKey, existingParamsToValidate, target, propertyKey);
    });
}
exports.validateParam = validateParam;
//# sourceMappingURL=validateParam.js.map