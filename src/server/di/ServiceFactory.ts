import { ServiceContext, ServiceFactory } from 'typescript-rest';

import { container } from './index';

/**
 * this is an IOC class to tell typescript-rest how to initialize
 * the serviceClass (route class)
 * in this case since we use inversify then we initialize it
 * by calling the container.get on the serviceClass (route class in our case)
 * the serviceClass itself needs to be handled by inversify
 */
export class RestServiceFactory implements ServiceFactory {
  public create(serviceClass: Function, context: ServiceContext) {
    return container.get(serviceClass);
  }

  public getTargetClass(serviceClass: Function): FunctionConstructor {
    return serviceClass as any;
  }
}
