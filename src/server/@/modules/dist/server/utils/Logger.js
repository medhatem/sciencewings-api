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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var Logger_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.COLORS = exports.LogLevel = void 0;
const colors = require("colors");
const winston_1 = require("winston");
const index_1 = require("@di/index");
const LocalStorage_1 = require("./LocalStorage");
const Configuration_1 = require("../configuration/Configuration");
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARNING"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
    LogLevel["VERBOSE"] = "verbose";
    LogLevel["SILLY"] = "silly,";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.COLORS = {
    Reset: '\x1b[0m',
    Blink: '\x1b[5m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Hidden: '\x1b[8m',
    Reverse: '\x1b[7m',
    Underscore: '\x1b[4m',
    FgBlack: '\x1b[30m',
    FgBlue: '\x1b[34m',
    FgCyan: '\x1b[36m',
    FgGreen: '\x1b[32m',
    FgMagenta: '\x1b[35m',
    FgRed: '\x1b[31m',
    FgWhite: '\x1b[37m',
    FgYellow: '\x1b[33m',
    BgBlack: '\x1b[40m',
    BgBlue: '\x1b[44m',
    BgCyan: '\x1b[46m',
    BgGreen: '\x1b[42m',
    BgMagenta: '\x1b[45m',
    BgRed: '\x1b[41m',
    BgWhite: '\x1b[47m',
    BgYellow: '\x1b[43m',
};
let Logger = Logger_1 = class Logger {
    constructor(store) {
        this.store = store;
    }
    static getInstance() {
        const logger = index_1.container.get(Logger_1);
        if (!logger.logger) {
            logger.setup((0, Configuration_1.getConfig)('logger.loglevel') || LogLevel.DEBUG);
        }
        return logger;
    }
    getFormat() {
        return winston_1.format.printf((_a) => {
            var { timestamp, level, message, requestId } = _a, meta = __rest(_a, ["timestamp", "level", "message", "requestId"]);
            const parts = new Array(20);
            this.logLevel(level, parts);
            this.logMessageAndExtras(message, meta, parts);
            return `[${timestamp}] - ${parts.join('')} `;
        });
    }
    logError(error, parts) {
        parts.push(`\n${exports.COLORS.BgRed}${error.stack}${exports.COLORS.Reset}`);
        return parts;
    }
    logLevel(level, parts) {
        switch (level) {
            case LogLevel.ERROR:
                parts.push(exports.COLORS.FgRed);
                break;
            case LogLevel.WARNING:
                parts.push(exports.COLORS.FgMagenta);
                break;
            case LogLevel.INFO:
                parts.push(exports.COLORS.FgGreen);
                break;
            case LogLevel.VERBOSE:
                parts.push(exports.COLORS.FgYellow);
                break;
            case LogLevel.DEBUG:
                parts.push(exports.COLORS.FgWhite);
                break;
            default:
                parts.push(exports.COLORS.FgCyan);
        }
        parts.push(`${level}${exports.COLORS.Reset} `);
        return parts;
    }
    logMessageAndExtras(message, meta, parts) {
        // Process message
        if (message instanceof Error) {
            parts.push('Error reported! Corresponding stack trace:');
            this.logError(message, parts);
        }
        else if (typeof message === 'object') {
            parts.push(JSON.stringify(message));
        }
        else {
            parts.push(`${message}`);
        }
        const metadataWithStoreId = Object.assign(Object.assign({}, meta), (this.store && this.store.getStore() ? { uniqueId: this.store.getStore().id } : {}));
        // PRocess extras
        for (const key of Object.keys(metadataWithStoreId)) {
            const data = metadataWithStoreId[key];
            if (data instanceof Error) {
                this.logError(data, parts);
            }
            else {
                parts.push(` extra[${key}]: ${JSON.stringify(data)}`);
            }
        }
        return parts;
    }
    setup(logLevel, injectedFormat = winston_1.format) {
        this.logger = (0, winston_1.createLogger)({
            exitOnError: false,
            format: injectedFormat.combine(injectedFormat.timestamp(), injectedFormat.splat(), this.getFormat()),
            transports: [
                new winston_1.transports.Console({
                    handleExceptions: true,
                    level: logLevel || 'debug',
                    silent: (0, Configuration_1.getConfig)('logger.displayNoLogs') || false,
                }),
            ],
        });
        return this.logger;
    }
    logWithLevel(message, level) {
        switch (level) {
            case LogLevel.ERROR:
                this.error(message);
                break;
            case LogLevel.WARNING:
                this.warn(message);
                break;
            case LogLevel.INFO:
                this.info(message);
                break;
            case LogLevel.VERBOSE:
                this.verbose(message);
                break;
            case LogLevel.DEBUG:
                this.log(message);
                break;
            default:
        }
    }
    log(message) {
        if ((0, Configuration_1.getConfig)('logger.displayManualLogs') === false) {
            return;
        }
        this.logger.debug(message);
    }
    logOverwrite(message) {
        if ((0, Configuration_1.getConfig)('logger.displayManualLogs') === false) {
            return;
        }
        // clearLine and cursorTo won't work in child processes
        process.stdout.clearLine && process.stdout.clearLine(-1);
        process.stdout.cursorTo && process.stdout.cursorTo(0);
        process.stdout.write(colors.cyan(message));
        this.logger.debug(message);
    }
    warn(message, ...meta) {
        if ((0, Configuration_1.getConfig)('logger.displayManualLogs') === false) {
            return;
        }
        this.logger.warn(colors.yellow(message), ...meta);
    }
    info(message, ...meta) {
        if ((0, Configuration_1.getConfig)('logger.displayManualLogs') === false) {
            return;
        }
        this.logger.info(colors.cyan(message), ...meta);
    }
    error(message, ...meta) {
        if ((0, Configuration_1.getConfig)('logger.displayManualLogs') === false) {
            return;
        }
        this.logger.error(colors.red(message), ...meta);
    }
    verbose(message, ...meta) {
        if ((0, Configuration_1.getConfig)('logger.displayManualLogs') === false) {
            return;
        }
        this.logger.verbose(colors.red(message), ...meta);
    }
};
Logger = Logger_1 = __decorate([
    (0, index_1.provideSingleton)(),
    __metadata("design:paramtypes", [LocalStorage_1.LocalStorage])
], Logger);
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map