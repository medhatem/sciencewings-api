import * as express from 'express';

import { ServiceAuthenticator } from 'typescript-rest';
import { UserExctractionAndValidation } from './userExctractionAndValidation';
import { provideSingleton } from '@/di';

@provideSingleton()
export class KeyCloakToken implements ServiceAuthenticator {
  constructor(private userExtractorAndValidator: UserExctractionAndValidation) {}

  getMiddleware(): any {
    return async (req: express.Request, response: express.Response, next: express.NextFunction) => {
      try {
        const result = await this.userExtractorAndValidator.userExctractionAndValidation(req);
        if (result.isFailure) {
          response.status(403).json({
            error: {
              message: result.error.message,
              statusCode: result.error.statusCode,
            },
          });
          response.end();
        } else {
          next();
        }
      } catch (error) {
        response.status(403).json({
          message: error.message,
          statusCode: 403,
        });
        response.end();
      }
    };
  }
  getRoles(): any[] {
    return [];
  }
  initialize(router: express.Router): void {
    router.use((req: express.Request, response: express.Response, next: express.NextFunction) => {
      next();
    });
  }
}
