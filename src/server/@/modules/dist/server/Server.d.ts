import './routes/index';
import * as cors from 'cors';
import * as express from 'express';
import { Configuration } from './configuration/Configuration';
import { OptionsJson, OptionsUrlencoded } from 'body-parser';
import { RequestHandler } from 'express';
import { Router } from 'express-serve-static-core';
export interface ExpressBodyParser {
    json(options: OptionsJson): RequestHandler;
    urlencoded(options: OptionsUrlencoded): RequestHandler;
}
export declare type ExpressRouter = (options?: express.RouterOptions) => Router;
export declare type ExpressCors = (options?: cors.CorsOptions | cors.CorsOptionsDelegate) => express.RequestHandler;
/**
 *  base class for Server that defines its base configuration
 *  the server runs an express app and handles multiple different routes
 *
 */
export declare class Server {
    private expressApp;
    private bodyParser;
    private expressCors;
    private expressRouter;
    private serverHealthStatus;
    constructor(config: Configuration, app?: express.Application, bodyParser?: ExpressBodyParser, expressCors?: ExpressCors, expressRouter?: ExpressRouter);
    startApp(): Promise<void>;
    private configureServer;
    /**
     * add all the application needed middlewares
     */
    private addMiddlewares;
    /**
     * method that adds all the server routes
     */
    private addRoutes;
    private configureAuthenticator;
    private startKeycloakAdmin;
    /**
     * configure the IOC module for typescript-rest to
     * define how the Routes will be initialized
     * We use Inverfify to initialize the Routes
     * and inverfify will take care of instanciating all the dependencies
     */
    private configureServiceFactory;
    healthCheker(): (request: express.Request, response: express.Response) => void;
    /**
     * create a connection to the postgres database
     */
    private setUpDataBase;
}
