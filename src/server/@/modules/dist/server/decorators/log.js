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
exports.log = void 0;
const Logger_1 = require("@utils/Logger");
const Configuration_1 = require("../configuration/Configuration");
/**
 * Method decorator that logs information about the decorated method
 * such as method name, method class and parameters it was called with
 *
 * the options parameter allows to customize the logging
 * example:
 * options:{
 *   message?: string;
 *   level: LogLevel;
 *   displayLogs?: boolean; // set to true by default
 * }
 *
 * if message is provided that given message is displayed instead of the default
 * if level is provided then display logs accordingly
 * if displayLogs is set to false then do not display logs for the current decorated method
 *
 *
 *
 * @param options logging options
 */
function log(options = {
    level: Logger_1.LogLevel.DEBUG,
}) {
    return (target, propertyKey, descriptor) => {
        const originalFunction = descriptor.value;
        const className = target.constructor.name;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(0, Configuration_1.getConfig)('logger.displayAutoLogs') ||
                    (options.displayLogs !== undefined && options.displayLogs === false)) {
                    return originalFunction.apply(this, args);
                }
                if ((0, Configuration_1.getConfig)('logger.logLevel')) {
                    options.level = (0, Configuration_1.getConfig)('logger.logLevel');
                }
                const message = !options.message
                    ? `in ${propertyKey} of ${className} with args: ${JSON.stringify(args)}`
                    : options.message;
                const logger = Logger_1.Logger.getInstance();
                logger.logWithLevel(message, options.level);
                return originalFunction.apply(this, args);
            });
        };
        return descriptor;
    };
}
exports.log = log;
//# sourceMappingURL=log.js.map