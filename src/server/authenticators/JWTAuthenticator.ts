import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { Errors, ServiceAuthenticator } from 'typescript-rest';

export class JWTAuthenticator implements ServiceAuthenticator {
  constructor() {}

  getMiddleware(): any {
    return (req: express.Request, response: express.Response, next: express.NextFunction) => {
      const token = req.headers.token as string;
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          throw new Errors.UnauthorizedError('Not Authenticated');
        }
        req.user = decoded;
        next();
      });
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
