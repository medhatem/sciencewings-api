import * as express from 'express';

import { Route } from './RouteTypes';
import { ServerError } from '../errors/ServerError';
import { provideSingleton } from '../di';

@provideSingleton()
export abstract class BaseRoutes {
  public routes: Route[] = [];
  constructor(private router: express.Router = express.Router()) {}

  static getInstance() {
    throw new ServerError('BaseRoutes class cannot be instanciated and must be overriden');
  }

  /**
   * bind and create the router routes by attaching the router method
   * to the defined handler for a given url
   */
  public bindRoutes(): void {
    this.routes.forEach((route: Route): void => {
      this.router[route.method](
        route.url,
        async (...args): Promise<void> => {
          try {
            await route.handler(...args);
          } catch (error) {
            const response: express.Response = args[1];
            response.status(error.status ? error.status : 500).send({
              error: error.message,
            });
          }
        },
      );
    });
  }

  // istanbul ignore next
  public getRouter(): express.Router {
    return this.router;
  }
}
