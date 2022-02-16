"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
require("./routes/index");
const BodyParser = require("body-parser");
const cors = require("cors");
const dotevnv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const Configuration_1 = require("./configuration/Configuration");
const di_1 = require("./di");
const constants_1 = require("./authenticators/constants");
const KeyCloakToken_1 = require("./authenticators/KeyCloakToken");
const keycloak_1 = require("@sdks/keycloak");
const typescript_rest_1 = require("typescript-rest");
const ServiceFactory_1 = require("@di/ServiceFactory");
const path_1 = require("path");
const db_1 = require("./db");
const swaggerUi = require("swagger-ui-express");
/**
 *  base class for Server that defines its base configuration
 *  the server runs an express app and handles multiple different routes
 *
 */
let Server = class Server {
    constructor(config, app = express(), bodyParser = BodyParser, expressCors = cors, expressRouter = express.Router) {
        this.serverHealthStatus = true;
        this.expressApp = app;
        this.bodyParser = bodyParser;
        this.expressCors = expressCors;
        this.expressRouter = expressRouter;
        config.init(); // initialize server configuration
    }
    startApp() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const port = (0, Configuration_1.getConfig)('baseConfig.port');
                yield this.configureServer();
                this.expressApp.listen(port);
                console.log(`server available at http://localhost:${port}`);
            }
            catch (error) {
                this.serverHealthStatus = false;
                console.error(`error when starting the server with env ${process.env.ENV} with message ${error}`);
            }
        });
    }
    configureServer() {
        return __awaiter(this, void 0, void 0, function* () {
            // start the database first since configureAuthenticator method needs the connection stream
            yield this.setUpDataBase();
            this.configureAuthenticator(); // this method has to be executed first before generating the middlewares
            this.configureServiceFactory();
            this.addMiddlewares();
            this.addRoutes();
            this.startKeycloakAdmin();
            // handleRequests();
        });
    }
    /**
     * add all the application needed middlewares
     */
    addMiddlewares() {
        this.expressApp.use(this.bodyParser.json({}));
        this.expressApp.use(this.bodyParser.urlencoded({ extended: false }));
        this.expressApp.use(this.expressCors());
        this.expressApp.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
        dotevnv.config(); // init the environement
    }
    /**
     * method that adds all the server routes
     */
    addRoutes() {
        const router = this.expressRouter();
        router.get('/health', this.healthCheker());
        this.expressApp.use(router);
        const data = require((0, path_1.join)(__dirname, './swagger.json'));
        this.expressApp.use('/api/docs', swaggerUi.serve, swaggerUi.setup(data));
        this.expressApp.use('/swagger', express.static(__dirname));
        typescript_rest_1.Server.buildServices(this.expressApp);
    }
    configureAuthenticator() {
        const keyCloakAuth = di_1.container.get(KeyCloakToken_1.KeyCloakToken);
        typescript_rest_1.Server.registerAuthenticator(keyCloakAuth, constants_1.KEYCLOAK_TOKEN);
    }
    startKeycloakAdmin() {
        keycloak_1.Keycloak.getInstance().init(); // initialize the keyCloak admin instance
    }
    /**
     * configure the IOC module for typescript-rest to
     * define how the Routes will be initialized
     * We use Inverfify to initialize the Routes
     * and inverfify will take care of instanciating all the dependencies
     */
    configureServiceFactory() {
        typescript_rest_1.Server.registerServiceFactory(new ServiceFactory_1.RestServiceFactory());
    }
    healthCheker() {
        return (request, response) => {
            if (this.serverHealthStatus) {
                response.status(200).send('OK');
            }
            else {
                response.status(500).send('Initialization failed check the log files');
            }
        };
    }
    /**
     * create a connection to the postgres database
     */
    setUpDataBase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, db_1.startDB)((0, Configuration_1.getConfig)('DB'));
            }
            catch (error) {
                console.log('error connecting to database', error);
            }
        });
    }
};
Server = __decorate([
    (0, di_1.provideSingleton)(),
    __metadata("design:paramtypes", [Configuration_1.Configuration, Function, Object, Function, Function])
], Server);
exports.Server = Server;
//# sourceMappingURL=Server.js.map