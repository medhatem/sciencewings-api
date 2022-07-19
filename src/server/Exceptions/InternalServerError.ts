import { BaseHttpError } from './BaseHttpError';

/**
 * Represents an INTERNAL SERVER error. The server encountered an unexpected condition
 * which prevented it from fulfilling the request.
 */
export class InternalServerError extends BaseHttpError {
  constructor(message: string, isOperational?: boolean) {
    super(message);
    this.isOperational = isOperational || true;
    this.statusCode = 500;
  }
}
