import { HttpError } from 'typescript-rest/dist/server/model/errors';

/**
 * The Base class for all HTTP errors
 */
export class BaseHttpError extends HttpError {
  statusCode: number;
  isOperational: boolean;
  constructor(public message: string, isOperational?: boolean) {
    super('', message);
    this.name = this.constructor.name;
    this.isOperational = isOperational;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }
}
