import * as colors from 'colors';

import { Format, TransformableInfo } from 'logform';
import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';

import { getConfig } from '../configuration/Configuration';
import { provideSingleton } from '@di/index';

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
  constructor(classNameId: string) {
    this.setup(classNameId, getConfig('currentENV'), LogLevel.DEBUG);
  }

  static getInstance(classNameId: string): Logger {
    return new Logger(classNameId);
  }

  private static getFormat(classNameId: string): Format {
    function logLevel(level: string, parts: string[]): string[] {
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
      parts.push(`${level.padStart('warning'.length)}${COLORS.Reset} - [${classNameId}] `);

      return parts;
    }

    function logError(error: Error, parts: string[]): string[] {
      parts.push(`\n${COLORS.BgRed}${error.stack}${COLORS.Reset}`);
      return parts;
    }

    function logMessageAndExtras(message: string | Error, meta: { [key: string]: any }, parts: string[]): string[] {
      // Process message
      if (message instanceof Error) {
        parts.push('Error reported! Corresponding stack trace:');
        logError(message, parts);
      } else {
        parts.push(`${message}`);
      }

      // PRocess extras
      for (const key of Object.keys(meta)) {
        const data = meta[key];
        if (data instanceof Error) {
          logError(data, parts);
        } else {
          parts.push(`; extra[${key}]: ${JSON.stringify(data)}`);
        }
      }

      return parts;
    }

    return format.printf(({ timestamp, level, message, requestId, ...meta }: TransformableInfo): string => {
      const parts: string[] = new Array(20);
      logLevel(level, parts);
      logMessageAndExtras(message, meta, parts);
      return parts.join('');
    });
  }

  public setup(classNameId: string, configMode: string, logLevel: string, injectedFormat: any = format): WinstonLogger {
    this.logger = createLogger({
      exitOnError: false, // do not exit on handled exceptions
      format: injectedFormat.combine(injectedFormat.timestamp(), injectedFormat.splat(), Logger.getFormat(classNameId)),
      transports: [
        new transports.Console({
          handleExceptions: true,
          level: logLevel || 'debug',
        }),
      ],
    });
    return this.logger;
  }

  log(message: string): void {
    this.logger.debug(message);
  }
  logOverwrite(message: string): void {
    // clearLine and cursorTo won't work in child processes
    process.stdout.clearLine && process.stdout.clearLine(-1);
    process.stdout.cursorTo && process.stdout.cursorTo(0);
    process.stdout.write(colors.cyan(message));
    this.logger.debug(message);
  }

  warn(message: string): void {
    this.logger.warn(colors.yellow(message));
  }
  info(message: string): void {
    this.logger.info(colors.cyan(message));
  }
  error(message: string): void {
    this.logger.error(colors.red(message));
  }
}
