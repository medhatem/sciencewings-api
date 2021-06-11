import * as express from 'express';

import { container, provideSingleton, unmanaged } from '../di';

import { BaseRoutes } from './BaseRoutes';
import { Route } from './RouteTypes';
import { UserService } from '../service/UserService';

@provideSingleton()
export class UserRoutes extends BaseRoutes {
  public routes: Route[] = [
    { method: 'post', url: '/api/v1/user/signup', handler: this.signup },
    { method: 'post', url: '/api/v1/user/signin', handler: this.signin },
  ];
  constructor(@unmanaged() router?: express.Router) {
    super(router);
    this.bindRoutes();
  }

  static getInstance(): UserRoutes {
    return container.get(UserRoutes);
  }

  /**
   *
   * use the user data given in the request body to create a new user entry
   * return the newly created user or an error
   *
   */
  private async signup(req: express.Request, res: express.Response) {
    const user = UserService.getInstance();
    const createdUserId = await user.signup(req.body);
    res.status(201).send(createdUserId);
  }
  /**
   * use credentials found in body to login a user into the application
   * return a response with the logged in user as well as its jwt token
   * return an error response if the credentials are wrong
   *
   */
  private async signin(req: express.Request, res: express.Response) {
    const user = UserService.getInstance();
    const loggedInUser = await user.signin(req.body);
    res.status(200).send(loggedInUser);
  }
}
