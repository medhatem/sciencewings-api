import * as colors from 'colors';

import { Format, TransformableInfo } from 'logform';
import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';
import { container, provideSingleton } from '@/di/index';

import { Json } from '../types/types';
import { LocalStorage } from './LocalStorage';
import { getConfig } from '../configuration/Configuration';

export type LogOptions = {
  message?: string;
  level: LogLevel;
  displayLogs?: boolean;
};

export enum LogLevel {
  ERROR = 'error',
  WARNING = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
  SILLY = 'silly,',
}

export const COLORS = {
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
@provideSingleton()
export class Logger {
  private logger: WinstonLogger;
  constructor(public store: LocalStorage) {}

  static getInstance(): Logger {
    const logger = container.get(Logger);
    if (!logger.logger) {
      logger.setup(getConfig('logger.loglevel') || LogLevel.DEBUG);
    }
    return logger;
  }

  private getFormat(): Format {
    return format.printf(({ timestamp, level, message, requestId, ...meta }: TransformableInfo): string => {
      const parts: string[] = new Array(20);
      this.logLevel(level, parts);
      this.logMessageAndExtras(message, meta, parts);
      return `[${timestamp}] - ${parts.join('')} `;
    });
  }

  logError(error: Error, parts: string[]): string[] {
    parts.push(`\n${COLORS.BgRed}${error.stack}${COLORS.Reset}`);
    return parts;
  }

  logLevel(level: string, parts: string[]): string[] {
    switch (level) {
      case LogLevel.ERROR:
        parts.push(COLORS.FgRed);
        break;
      case LogLevel.WARNING:
        parts.push(COLORS.FgMagenta);
        break;
      case LogLevel.INFO:
        parts.push(COLORS.FgGreen);
        break;
      case LogLevel.VERBOSE:
        parts.push(COLORS.FgYellow);
        break;
      case LogLevel.DEBUG:
        parts.push(COLORS.FgWhite);
        break;
      default:
        parts.push(COLORS.FgCyan);
    }
    parts.push(`${level}${COLORS.Reset} `);

    return parts;
  }

  logMessageAndExtras(message: string | Error | Json, meta: { [key: string]: any }, parts: string[]): string[] {
    // Process message
    if (message instanceof Error) {
      parts.push('Error reported! Corresponding stack trace:');
      this.logError(message, parts);
    } else if (typeof message === 'object') {
      parts.push(JSON.stringify(message));
    } else {
      parts.push(`${message}`);
    }
    const metadataWithStoreId: { [key: string]: any } = {
      ...meta,
      ...(this.store && this.store.getStore() ? { uniqueId: this.store.getStore().id } : {}),
    };

    // PRocess extras
    for (const key of Object.keys(metadataWithStoreId)) {
      const data = metadataWithStoreId[key];
      if (data instanceof Error) {
        this.logError(data, parts);
      } else {
        parts.push(` extra[${key}]: ${JSON.stringify(data)}`);
      }
    }

    return parts;
  }

  public setup(logLevel: string, injectedFormat: any = format): WinstonLogger {
    this.logger = createLogger({
      exitOnError: false, // do not exit on handled exceptions
      format: injectedFormat.combine(injectedFormat.timestamp(), injectedFormat.splat(), this.getFormat()),
      transports: [
        new transports.Console({
          handleExceptions: true,
          level: logLevel || 'debug',
          silent: getConfig('logger.displayNoLogs') || false,
        }),
      ],
    });

    return this.logger;
  }

  logWithLevel(message: string, level: LogLevel) {
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

  log(message: string): void {
    if (getConfig('logger.displayManualLogs') === false) {
      return;
    }
    this.logger.debug(message);
  }
  logOverwrite(message: string): void {
    if (getConfig('logger.displayManualLogs') === false) {
      return;
    }
    // clearLine and cursorTo won't work in child processes
    process.stdout.clearLine && process.stdout.clearLine(-1);
    process.stdout.cursorTo && process.stdout.cursorTo(0);
    process.stdout.write(colors.cyan(message));
    this.logger.debug(message);
  }

  warn(message: string, ...meta: any[]): void {
    if (getConfig('logger.displayManualLogs') === false) {
      return;
    }
    this.logger.warn(colors.yellow(message as string), ...meta);
  }
  info(message: string, ...meta: any[]): void {
    if (getConfig('logger.displayManualLogs') === false) {
      return;
    }
    this.logger.info(colors.cyan(message as string), ...meta);
  }
  error(message: string, ...meta: any[]): void {
    if (getConfig('logger.displayManualLogs') === false) {
      return;
    }
    this.logger.error(colors.red(message as string), ...meta);
  }
  verbose(message: string, ...meta: any[]): void {
    if (getConfig('logger.displayManualLogs') === false) {
      return;
    }
    this.logger.verbose(colors.red(message as string), ...meta);
  }
}
