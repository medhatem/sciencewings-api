import { BaseHttpError } from './BaseHttpError';

/**
 * Represents a VALIDATION ERROR. The server encountered wrong client sent data
 * which prevented it from fulfilling a specific request.
 */
export class ValidationError extends BaseHttpError {
  constructor(message: string) {
    super(message);
    this.isOperational = true;
    this.statusCode = 400;
  }
}
