import * as BodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotevnv from 'dotenv';
import * as express from 'express';
import * as mongooseORM from 'mongoose';

import { BaseConfig, EnvConfig, ServerConfiguration, ServerDBConfig } from './types/ServerConfiguration';
import { OptionsJson, OptionsUrlencoded } from 'body-parser';

import { RequestHandler } from 'express';
import { RouteEntity } from './routes/RouteTypes';
import { Router } from 'express-serve-static-core';
import { appRoutes } from './routes/index';

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
  private mongoose: typeof mongooseORM;
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
    mongoose: typeof mongooseORM = mongooseORM,
  ) {
    this.expressApp = app;
    this.bodyParser = bodyParser;
    this.expressCors = expressCors;
    this.expressRouter = expressRouter;
    this.mongoose = mongoose;
    this.envConfig = this.config[
      ((process.env.ENV as any) as keyof ServerConfiguration) || this.config.currentENV || 'dev'
    ] as EnvConfig;
    this.baseConfig = this.envConfig.baseConfig;
    this.dbConfig = this.envConfig.DB;
  }

  public async startApp(): Promise<void> {
    try {
      const port = (this.baseConfig && this.baseConfig.port) || 8080;
      this.addMiddlewares();
      this.addRoutes();
      await this.setUpDataBase();
      this.expressApp.listen(port);
      console.log(`server available at http://localhost:${process.env.PORT || port}`);
    } catch (error) {
      this.serverHealthStatus = false;
      console.error(`error when starting the server with env ${process.env.ENV} with message ${error.message}`);
    }
  }

  /**
   * add all the application needed middlewares
   */
  private addMiddlewares(): void {
    this.expressApp.use(this.bodyParser.json({}));
    this.expressApp.use(this.bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(this.expressCors());
    dotevnv.config(); // init the environementb
  }

  /**
   * method that adds all the server routes
   */
  private addRoutes() {
    const router = this.expressRouter();
    router.get('/health', this.healthCheker());
    router.get('/routes', this.getAppRoutes());
    this.expressApp.use(router);
    appRoutes.forEach((appRoute: RouteEntity) => this.expressApp.use(appRoute.router));
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
   * displays all the available routes in the entires app
   */
  public getAppRoutes(): (request: express.Request, response: express.Response) => void {
    return (request: express.Request, response: express.Response): void => {
      const routes: any = appRoutes.reduce((acc, curr) => {
        acc[curr.name] = {
          ...curr.router.stack.reduce((accumulator, current) => {
            accumulator[current.route.path] = Object.keys(current.route.methods)[0];
            return accumulator;
          }, {}),
        };
        return acc;
      }, {} as any);
      response.json(routes);
    };
  }

  /**
   * create a connection to the mongodb database
   */
  private async setUpDataBase(): Promise<void> {
    try {
      const dbUrl: string = this.dbConfig.url;
      const url = dbUrl
        .replace('<username>', this.dbConfig.dbUsername)
        .replace('<password>', this.dbConfig.dbPassword)
        .replace('<dbname>', this.dbConfig.dbName);
      await this.mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
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
