import * as express from 'express';

import { ServiceAuthenticator } from 'typescript-rest';
import { userExctractionAndValidation } from './userExctractionAndValidation';

export class KeyCloakToken implements ServiceAuthenticator {
  constructor() {}

  getMiddleware(): any {
    return async (req: express.Request, response: express.Response, next: express.NextFunction) => {
      try {
        await userExctractionAndValidation(req);
        next();
      } catch (error) {
        response.status(403).json({
          error: error.message,
        });
        response.end();
      }
    };
  }
  getRoles(req: express.Request): any[] {
    return [];
  }
  initialize(router: express.Router): void {
    router.use((req: express.Request, response: express.Response, next: express.NextFunction) => {
      next();
    });
  }
}
