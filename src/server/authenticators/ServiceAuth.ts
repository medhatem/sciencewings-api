import * as express from 'express';

import { ServiceAuthenticator } from 'typescript-rest';

//@ts-ignore
export interface ServiceAuth extends ServiceAuthenticator {
  getMiddleware(roles: string[]): express.RequestHandler;
}
