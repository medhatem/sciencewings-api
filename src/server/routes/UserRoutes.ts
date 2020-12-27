import * as express from 'express';

import { UserService } from '../service/UserService';

export const userRouter = express.Router();

/**
 *
 * use the user data given in the request body to create a new user entry
 * return the newly created user or an error
 *
 */
userRouter.post(
  '/api/v1/user/signup',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = UserService.getInstance();
      const createdUserId = await user.create(req.body);
      res.status(200).send(createdUserId);
    } catch (error) {
      res.status(error.status ? error.status : 500).send({
        error: error.message,
      });
    }
  },
);

/**
 * use credentials found in body to login a user into the application
 * return a response with the logged in user as well as its jwt token
 * return an error response if the credentials are wrong
 *
 */
userRouter.post(
  '/api/v1/user/signin',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = UserService.getInstance();
      const loggedInUser = await user.signin(req.body);
      res.status(200).send(loggedInUser);
    } catch (error) {
      res.status(error.status ? error.status : 500).send({
        error: error.message,
      });
    }
  },
);
