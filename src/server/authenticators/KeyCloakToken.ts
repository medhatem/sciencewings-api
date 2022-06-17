import * as express from 'express';

import { Security } from '@/sdks/security/Security';
import { ServiceAuthenticator } from 'typescript-rest';
import { UserExctractionAndValidation } from './userExctractionAndValidation';
import { provideSingleton } from '@/di';

@provideSingleton()
export class KeyCloakToken implements ServiceAuthenticator {
  constructor(private userExtractorAndValidator: UserExctractionAndValidation, private securityLayer: Security) {}

  /* eslint-disable-next-line */
  //@ts-ignore
  getMiddleware(roles: string[]): any {
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
          const token = req.headers.authorization as string;
          // validate the roles
          const canUserAccess = await this.securityLayer.validateAccess(token, roles);
          if (canUserAccess.isFailure) {
            response.status(403).json({
              error: {
                message: result.error.message,
                statusCode: result.error.statusCode,
              },
            });
            response.end();
          } else if (!canUserAccess.getValue()) {
            response.status(403).json({
              error: {
                message: 'Anauthorized',
                statusCode: 403,
              },
            });
            response.end();
          } else {
            next();
          }
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
