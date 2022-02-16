import * as express from 'express';
export declare type RouteMethod = 'post' | 'get' | 'put' | 'delete' | 'patch';
export declare type Handler = (req: express.Request, res: express.Response, next?: express.NextFunction) => Promise<any>;
export declare type Route = {
    method: RouteMethod;
    url: string;
    handler: Handler;
};
export declare type RouteEntity = {
    name: string;
    router: express.Router;
};
