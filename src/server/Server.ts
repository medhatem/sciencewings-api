import * as BodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotevnv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';

import { Configuration, getConfig } from './configuration/Configuration';
import { OptionsJson, OptionsUrlencoded } from 'body-parser';
import { container, provideSingleton } from '@/di';

import { KeyCloakToken } from './authenticators/KeyCloakToken';
import { Keycloak } from '@/sdks/keycloak';
import { RequestHandler } from 'express';
import { Server as RestServer } from 'typescript-rest';
import { RestServiceFactory } from '@/di/ServiceFactory';
import { Router } from 'express-serve-static-core';
import { join } from 'path';
import { startDB } from './db';

import swaggerUi = require('swagger-ui-express');

export interface ExpressBodyParser {
  json(options: OptionsJson): RequestHandler;
  urlencoded(options: OptionsUrlencoded): RequestHandler;
}

export type ExpressRouter = (options?: express.RouterOptions) => Router;
export type ExpressCors = (options?: cors.CorsOptions | cors.CorsOptionsDelegate) => express.RequestHandler;

/**
 *  base class for Server that defines its base configuration
 *  the server runs an express app and handles multiple different routes
 *
 */
@provideSingleton()
export class Server {
  private expressApp: express.Application;
  private bodyParser: ExpressBodyParser;
  private expressCors: ExpressCors;
  private expressRouter: ExpressRouter;
  private serverHealthStatus = true;
  constructor(
    config: Configuration,
    app: express.Application = express(),
    bodyParser: ExpressBodyParser = BodyParser,
    expressCors: ExpressCors = cors,
    expressRouter: ExpressRouter = express.Router,
  ) {
    this.expressApp = app;
    this.bodyParser = bodyParser;
    this.expressCors = expressCors;
    this.expressRouter = expressRouter;
    config.init(); // initialize server configuration
  }

  public async startApp(): Promise<void> {
    try {
      const port = getConfig('baseConfig.port');
      await this.configureServer();
      this.expressApp.listen(port);
      console.log(`server available at http://localhost:${port}`);
    } catch (error) {
      this.serverHealthStatus = false;
      console.error(`error when starting the server with env ${process.env.ENV} with message ${error}`);
    }
  }

  private async configureServer() {
    // start the database first since configureAuthenticator method needs the connection stream
    await this.setUpDataBase();

    this.configureAuthenticator(); // this method has to be executed first before generating the middlewares
    this.configureServiceFactory();
    this.addMiddlewares();
    this.addRoutes();
    this.startKeycloakAdmin();
    // handleRequests();
  }

  /**
   * add all the application needed middlewares
   */
  private addMiddlewares(): void {
    this.expressApp.use(this.bodyParser.json({}));
    this.expressApp.use(this.bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(this.expressCors());
    this.expressApp.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

    dotevnv.config(); // init the environement
  }

  /**
   * method that adds all the server routes
   */
  private addRoutes() {
    const router = this.expressRouter();
    router.get('/health', this.healthCheker());
    this.expressApp.use(router);
    const data = require(join(__dirname, './swagger.json'));
    this.expressApp.use('/api/docs', swaggerUi.serve, swaggerUi.setup(data));
    this.expressApp.use('/swagger', express.static(__dirname));
    RestServer.buildServices(this.expressApp);
  }

  private configureAuthenticator() {
    const keyCloakAuth = container.get(KeyCloakToken);
    RestServer.registerAuthenticator(keyCloakAuth); // register the default authenticator which will be the keycloak jwt token
  }

  private startKeycloakAdmin() {
    Keycloak.getInstance().init(); // initialize the keyCloak admin instance
  }
  /**
   * configure the IOC module for typescript-rest to
   * define how the Routes will be initialized
   * We use Inverfify to initialize the Routes
   * and inverfify will take care of instanciating all the dependencies
   */
  private configureServiceFactory() {
    RestServer.registerServiceFactory(new RestServiceFactory());
  }

  public healthCheker(): (request: express.Request, response: express.Response) => void {
    return (request: express.Request, response: express.Response): void => {
      if (this.serverHealthStatus) {
        response.status(200).send('OK');
      } else {
        response.status(500).send('Initialization failed check the log files');
      }
    };
  }

  /**
   * create a connection to the postgres database
   */
  private async setUpDataBase(): Promise<void> {
    try {
      await startDB(getConfig('DB'));
    } catch (error) {
      console.log('error connecting to database', error);
    }
  }
}
