import { ServiceFactory } from 'typescript-rest';
/**
 * this is an IOC class to tell typescript-rest how to initialize
 * the serviceClass (route class)
 * in this case since we use inversify then we initialize it
 * by calling the container.get on the serviceClass (route class in our case)
 * the serviceClass itself needs to be handled by inversify
 */
export declare class RestServiceFactory implements ServiceFactory {
    create(serviceClass: any): unknown;
    getTargetClass(serviceClass: any): FunctionConstructor;
}
