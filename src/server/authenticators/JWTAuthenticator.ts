import * as express from 'express';

import { ACCESS_TOKEN_HEADER } from './constants';
import { ServiceAuthenticator } from 'typescript-rest';

// import * as jwt from 'jsonwebtoken';

export class JWTAuthenticator implements ServiceAuthenticator {
  constructor() {}

  getMiddleware(): any {
    return (req: express.Request, response: express.Response, next: express.NextFunction) => {
      const token = req.headers[ACCESS_TOKEN_HEADER] as string;
      console.log('token is --', token);
      // jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      //   if (err) {
      //     throw new Errors.UnauthorizedError('Not Authenticated');
      //   }
      //   req.user = decoded;
      //   next();
      // });
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
