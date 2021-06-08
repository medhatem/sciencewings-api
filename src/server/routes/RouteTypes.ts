import * as express from 'express';

export type RouteMethod = 'post' | 'get' | 'put' | 'delete' | 'patch';
export type Handler = (req: express.Request, res: express.Response, next?: express.NextFunction) => Promise<any>;
export type Route = {
  method: RouteMethod;
  url: string;
  handler: Handler;
};

export type RouteEntity = {
  name: string;
  router: express.Router;
};
