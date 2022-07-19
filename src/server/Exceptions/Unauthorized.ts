import { BaseHttpError, Vars } from './BaseHttpError';

/**
 * Represents an UNAUTHORIZED ERROR. The server detected a non logged in client
 */
export class Unauthorized extends BaseHttpError {
  constructor(public message: string = 'Not Authorized', variables: Vars = null, isOperational = true) {
    super(message, variables, isOperational);
    this.statusCode = 403;
  }
}
