import * as express from 'express';

import { UserService } from '../service/UserService';

export const userRouter = express.Router();

userRouter.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = await UserService.getInstance().get('id');
  console.log('resource user is ', user);
  res.status(200).send('OK!');
});

userRouter.post('/user/add', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = UserService.getInstance();
  const createdUserId = await user.create(req.body);
  res.status(200).send(createdUserId);
});
