"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestServiceFactory = void 0;
const index_1 = require("./index");
/**
 * this is an IOC class to tell typescript-rest how to initialize
 * the serviceClass (route class)
 * in this case since we use inversify then we initialize it
 * by calling the container.get on the serviceClass (route class in our case)
 * the serviceClass itself needs to be handled by inversify
 */
class RestServiceFactory {
    create(serviceClass) {
        return index_1.container.get(serviceClass);
    }
    getTargetClass(serviceClass) {
        return serviceClass;
    }
}
exports.RestServiceFactory = RestServiceFactory;
//# sourceMappingURL=ServiceFactory.js.map