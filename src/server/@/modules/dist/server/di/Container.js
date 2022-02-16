"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const inversify_1 = require("inversify");
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
// istanbul ignore next
class Container extends inversify_1.Container {
    constructor() {
        super({ skipBaseClassChecks: true });
    }
    initialize() {
        this.bind(Container).toConstantValue(this);
        // Reflects all decorators provided by this package and packages them into
        // a module to be loaded by the container
        this.load((0, inversify_binding_decorators_1.buildProviderModule)());
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map