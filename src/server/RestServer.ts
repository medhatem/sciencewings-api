import * as express from 'express';

import { Server } from 'typescript-rest';
import { ServerContainer } from 'typescript-rest/dist/server/server-container';

export class RestServer extends Server {
  constructor() {
    super();
  }

  static buildServices(router: express.Router, ...types: Array<any>) {
    /* eslint-disable-next-line */
    //@ts-ignore access to private member
    if (!RestServer.locked) {
      const serverContainer = ServerContainer.get();

      /**
       * override the buildSecurityMiddlewares method of ServerContainer from typescript-rest lib
       * this allows us to define our own way of handling the authorization with the roles
       *
       * the getMiddleware method now takes the roles to verify against
       *
       * @param serviceClass
       * @param serviceMethod
       */
      /* eslint-disable-next-line */
      //@ts-ignore access to private member
      serverContainer.buildSecurityMiddlewares = (serviceClass, serviceMethod) => {
        const result = [];
        const authenticatorMap = serviceMethod.authenticator || serviceClass.authenticator;
        if (serverContainer.authenticator && authenticatorMap) {
          const authenticatorNames = Object.keys(authenticatorMap);
          for (const authenticatorName of authenticatorNames) {
            let roles = authenticatorMap[authenticatorName];
            /* eslint-disable-next-line */
            //@ts-ignore access to private member
            const authenticator = serverContainer.getAuthenticator(authenticatorName);
            roles = roles.filter((role: any) => role !== '*');
            result.push(authenticator.getMiddleware(roles));
          }
        }
        return result;
      };

      serverContainer.router = router;
      serverContainer.buildServices(types);
    }
  }
}
