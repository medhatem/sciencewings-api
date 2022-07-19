import { BaseHttpError, Vars } from './BaseHttpError';

/**
 * Represents an INTERNAL SERVER error. The server encountered an unexpected condition
 * which prevented it from fulfilling the request.
 */
export class InternalServerError extends BaseHttpError {
  constructor(message: string, variables: Vars = null, isOperational = true) {
    super(message, variables, isOperational);
    this.statusCode = 500;
  }
}
