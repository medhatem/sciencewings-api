import { BaseHttpError, Vars } from './BaseHttpError';

/**
 * Represents a VALIDATION ERROR. The server encountered wrong client sent data
 * which prevented it from fulfilling a specific request.
 */
export class ValidationError extends BaseHttpError {
  constructor(message: string, variables: Vars = null, isOperational = true) {
    super(message, variables, isOperational);
    this.statusCode = 400;
  }
}
