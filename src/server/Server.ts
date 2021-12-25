import './routes/index';

import * as BodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotevnv from 'dotenv';
import * as express from 'express';
import * as methodOverride from 'method-override';

import { BaseConfig, EnvConfig, ServerConfiguration, ServerDBConfig } from './types/ServerConfiguration';
import { OptionsJson, OptionsUrlencoded } from 'body-parser';

import { JWTAuthenticator } from './authenticators/JWTAuthenticator';
import { RegisterRoutes } from './tsoa-build/routes';
import { RequestHandler } from 'express';
import { Server as RestServer } from 'typescript-rest';
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

export class Server {
  private expressApp: express.Application;
  private bodyParser: ExpressBodyParser;
  private expressCors: ExpressCors;
  private expressRouter: ExpressRouter;
  private serverHealthStatus = true;
  private envConfig: EnvConfig;
  private baseConfig: BaseConfig;
  private dbConfig: ServerDBConfig;
  constructor(
    private config: ServerConfiguration,
    app: express.Application = express(),
    bodyParser: ExpressBodyParser = BodyParser,
    expressCors: ExpressCors = cors,
    expressRouter: ExpressRouter = express.Router,
  ) {
    this.expressApp = app;
    this.bodyParser = bodyParser;
    this.expressCors = expressCors;
    this.expressRouter = expressRouter;
    this.envConfig = this.config[
      (process.env.ENV as any as keyof ServerConfiguration) || this.config.currentENV || 'dev'
    ] as EnvConfig;
    this.baseConfig = this.envConfig.baseConfig;
    this.dbConfig = this.envConfig.DB;
    console.log(this.dbConfig);
  }

  public async startApp(): Promise<void> {
    try {
      const port = (this.baseConfig && this.baseConfig.port) || 8080;
      await this.configureServer();
      this.expressApp.listen(port);
      console.log(`server available at http://localhost:${process.env.PORT || port}`);
    } catch (error) {
      this.serverHealthStatus = false;
      console.error(`error when starting the server with env ${process.env.ENV} with message ${error.message}`);
    }
  }

  private async configureServer() {
    this.addMiddlewares();
    this.addRoutes();
    await this.setUpDataBase();
    this.configureAuthenticator();
    this.configureTypescriptRestRoutes();
  }

  /**
   * add all the application needed middlewares
   */
  private addMiddlewares(): void {
    this.expressApp.use(this.bodyParser.json({}));
    this.expressApp.use(this.bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(this.expressCors());
    dotevnv.config(); // init the environement
  }

  /**
   * method that adds all the server routes
   */
  private addRoutes() {
    const router = this.expressRouter();
    router.get('/health', this.healthCheker());
    this.expressApp.use(router);
    const data = require(join(__dirname, './tsoa-build/swagger.json'));
    this.expressApp.use('/api/docs', swaggerUi.serve, swaggerUi.setup(data));
  }
  /**
   * generates the routes declared with tsoa and add them
   * to the main express application
   * generates also their swagger documentation
   */
  private configureTypescriptRestRoutes() {
    this.expressApp.use(methodOverride());
    RegisterRoutes(this.expressApp);
  }

  private configureAuthenticator() {
    const authenticator = new JWTAuthenticator();
    RestServer.registerAuthenticator(authenticator);
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
      await startDB(this.dbConfig);
    } catch (error) {
      console.log('error connecting to database', error);
    }
  }

  // istanbul ignore next
  public getConfig(): ServerConfiguration {
    return this.config;
  }
  // istanbul ignore next
  public setConfig(config: ServerConfiguration) {
    this.config = config;
  }
}
