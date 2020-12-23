import * as express from 'express';

export const router = express.Router();

// base route
router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(200).send('OK!');
});
