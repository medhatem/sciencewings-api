// import * as Mongoose from 'mongoose';
// import * as cors from 'cors';
// import * as express from 'express';

// import { ExpressBodyParser, ExpressCors, ExpressRouter, Server } from '../server/Server';
// import { SinonStubbedInstance, createStubInstance, match, restore, spy, stub } from 'sinon';

// import { Configuration } from '../server/configuration/Configuration';
// import { Router } from 'express-serve-static-core';
// import intern from 'intern';

// // const { describe, it } = intern.getPlugin('interface.bdd');
// const { suite, test, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
// const { assert, expect } = intern.getPlugin('chai');
// suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
//   let expressApp: express.Application;
//   let bodyParser: ExpressBodyParser;
//   let expressCors: ExpressCors;
//   let expressRouter: ExpressRouter;
//   let mongoose: SinonStubbedInstance<Mongoose.Mongoose>;
//   let server: Server;
//   const config: Configuration = {
//     currentENV: 'dev',
//     dev: {
//       baseConfig: {
//         port: 8080,
//       },
//       DB: {
//         host: '127.0.0.1',
//         port: 5432,
//         dbName: 'name',
//         dbPassword: 'password',
//         dbUsername: 'username',
//       },
//       keycloak: {
//         'client-id': 'client-id',
//         grantType: 'password',
//         password: 'pass',
//         username: 'user',
//         baseUrl: '',
//       },
//     },
//   };
//   beforeEach((): void => {
//     expressApp = {
//       use(): express.Application {
//         return null;
//       },
//       // @ts-ignore one implementation only
//       listen(port: number): void {
//         return;
//       },
//     };
//     bodyParser = {
//       json(): express.Application {
//         return null;
//       },
//       urlencoded(): express.Application {
//         return null;
//       },
//     };

//     expressCors = (options?: cors.CorsOptions | cors.CorsOptionsDelegate): express.RequestHandler => {
//       return null;
//     };
//     expressRouter = (options?: express.RouterOptions): Router => {
//       // @ts-ignore one implementation only
//       return {
//         get(): any {
//           return null;
//         },
//       };
//     };
//     mongoose = createStubInstance<Mongoose.Mongoose>(Mongoose.Mongoose);

//     server = new Server(
//       config,
//       (expressApp as any) as express.Application,
//       (bodyParser as any) as ExpressBodyParser,
//       (expressCors as any) as ExpressCors,
//       (expressRouter as any) as ExpressRouter,
//     );
//   });
//   afterEach((): void => {
//     restore();
//   });

//   test('initializes the server', async (): Promise<void> => {
//     // @ts-ignore access private member
//     assert.strictEqual(server.expressApp, expressApp);
//     // @ts-ignore access private member
//     assert.strictEqual(server.bodyParser, bodyParser);
//     // @ts-ignore access private member
//     assert.strictEqual(server.expressCors, expressCors);
//     // @ts-ignore access private member
//     assert.strictEqual(server.expressRouter, expressRouter);
//   });
//   test('starts the app', async (): Promise<void> => {
//     const expressUseStub = stub(expressApp, 'use');
//     const expressListenStub = stub(expressApp, 'listen');

//     await server.startApp();
//     assert.equal(expressUseStub.callCount, 5);
//     assert.equal(expressListenStub.callCount, 1);
//   });
//   test('change health status to false when error is thrown during server start', async (): Promise<void> => {
//     const errorMessage = 'server not started!!';
//     const port = config[config.currentENV].baseConfig.port;
//     const expressUseStub = stub(expressApp, 'use');
//     const expressListenStub = stub(expressApp, 'listen');
//     expressListenStub.withArgs(port).throws(new Error(errorMessage));
//     await server.startApp();
//     assert.equal(expressUseStub.callCount, 5);
//     assert.equal(expressListenStub.callCount, 1);
//     // @ts-ignore access to private member
//     assert.equal(server.serverHealthStatus, false);
//   });
//   suite('server health', () => {
//     test('WHEN server health status is true', async (): Promise<void> => {
//       stub(expressApp, 'use');
//       stub(expressApp, 'listen');
//       await server.startApp();

//       // @ts-ignore no implementation
//       const request: express.Request = {};

//       // @ts-ignore two implementations only
//       const response: express.Response = {
//         status(code: any): any {
//           return this;
//         },
//         send(message: string): any {
//           return this;
//         },
//       };

//       const responseStatusStub = spy(response, 'status');
//       const responseSendStatus = spy(response, 'send');

//       server.healthCheker()(request, response);
//       expect(responseStatusStub.calledOnceWithExactly(200)).to.be.true;
//       expect(responseSendStatus.calledOnceWithExactly('OK')).to.be.true;
//     });
//     test('WHEN server health status is false', async (): Promise<void> => {
//       stub(expressApp, 'use');
//       stub(expressApp, 'listen');
//       await server.startApp();
//       // @ts-ignore access to private member
//       server.serverHealthStatus = false;

//       // @ts-ignore no implementation
//       const request: express.Request = {};

//       // @ts-ignore two implementations only
//       const response: express.Response = {
//         status(code: any): any {
//           return this;
//         },
//         send(message: string): any {
//           return this;
//         },
//       };

//       const responseStatusStub = spy(response, 'status');
//       const responseSendStatus = spy(response, 'send');

//       server.healthCheker()(request, response);
//       expect(responseStatusStub.calledOnceWithExactly(500)).to.be.true;
//       expect(responseSendStatus.calledOnceWithExactly('Initialization failed check the log files')).to.be.true;
//     });
//   });

//   suite('mongodb ', () => {
//     test('should connect to mongo successfully', async (): Promise<void> => {
//       stub(expressApp, 'use');
//       stub(expressApp, 'listen');
//       mongoose.connect
//         .withArgs(
//           `mongodb+srv://${config.dev.DB.dbUsername}:${config.dev.DB.dbPassword}@manacluster.ifqmj.mongodb.net/
//         ${config.dev.DB.dbName}?retryWrites=true&w=majority`,
//           match({ useNewUrlParser: true, useUnifiedTopology: true }),
//         )
//         .resolves(Mongoose);
//       await server.startApp();

//       expect(mongoose.connect.callCount).to.equal(1);
//     });
//   });
// });
