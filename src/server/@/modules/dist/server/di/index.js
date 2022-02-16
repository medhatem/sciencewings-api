"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingest = exports.provide = exports.provideSingleton = exports.lazyInject = exports.container = exports.unmanaged = exports.inject = exports.injectable = exports.Container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const Container_1 = require("./Container");
const inversify_inject_decorators_1 = require("inversify-inject-decorators");
var Container_2 = require("./Container");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return Container_2.Container; } });
var inversify_2 = require("inversify");
Object.defineProperty(exports, "injectable", { enumerable: true, get: function () { return inversify_2.injectable; } });
Object.defineProperty(exports, "inject", { enumerable: true, get: function () { return inversify_2.inject; } });
Object.defineProperty(exports, "unmanaged", { enumerable: true, get: function () { return inversify_2.unmanaged; } });
exports.container = new Container_1.Container();
const { lazyInject } = (0, inversify_inject_decorators_1.default)(exports.container);
exports.lazyInject = lazyInject;
/**
 * class level decorator to flag a class being a sigleton in the DI container
 *
 * @param identifier optional DI identifier of the decorated class if provided or defaults to the class itself
 */
function provideSingleton(identifier) {
    return (target) => {
        exports.container
            .bind(identifier || target)
            .to(target)
            .inSingletonScope();
        return (0, inversify_1.injectable)()(target);
    };
}
exports.provideSingleton = provideSingleton;
/**
 *
 * class level decorator to flag a class and provde an instance of it in the DI container
 *
 * @param identifier optional DI identifier of the decorated class if provided or defaults to the class itself
 */
function provide(identifier) {
    return (target) => {
        exports.container.bind(identifier || target).to(target);
        return (0, inversify_1.injectable)()(target);
    };
}
exports.provide = provide;
/**
 * lazily inject an identifier using inversify
 * this helps with circular dependencies
 * where it only injects when the property is used
 *
 * @param identifier the target that needs to be ingested
 */
function ingest(identifier) {
    return lazyInject(identifier);
}
exports.ingest = ingest;
//# sourceMappingURL=index.js.map