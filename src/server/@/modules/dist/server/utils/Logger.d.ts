import { Logger as WinstonLogger } from 'winston';
import { Json } from '../types/types';
import { LocalStorage } from './LocalStorage';
export declare type LogOptions = {
    message?: string;
    level: LogLevel;
    displayLogs?: boolean;
};
export declare enum LogLevel {
    ERROR = "error",
    WARNING = "warn",
    INFO = "info",
    DEBUG = "debug",
    VERBOSE = "verbose",
    SILLY = "silly,"
}
export declare const COLORS: {
    Reset: string;
    Blink: string;
    Bright: string;
    Dim: string;
    Hidden: string;
    Reverse: string;
    Underscore: string;
    FgBlack: string;
    FgBlue: string;
    FgCyan: string;
    FgGreen: string;
    FgMagenta: string;
    FgRed: string;
    FgWhite: string;
    FgYellow: string;
    BgBlack: string;
    BgBlue: string;
    BgCyan: string;
    BgGreen: string;
    BgMagenta: string;
    BgRed: string;
    BgWhite: string;
    BgYellow: string;
};
export declare class Logger {
    store: LocalStorage;
    private logger;
    constructor(store: LocalStorage);
    static getInstance(): Logger;
    private getFormat;
    logError(error: Error, parts: string[]): string[];
    logLevel(level: string, parts: string[]): string[];
    logMessageAndExtras(message: string | Error | Json, meta: {
        [key: string]: any;
    }, parts: string[]): string[];
    setup(logLevel: string, injectedFormat?: any): WinstonLogger;
    logWithLevel(message: string, level: LogLevel): void;
    log(message: string): void;
    logOverwrite(message: string): void;
    warn(message: string, ...meta: any[]): void;
    info(message: string, ...meta: any[]): void;
    error(message: string, ...meta: any[]): void;
    verbose(message: string, ...meta: any[]): void;
}
