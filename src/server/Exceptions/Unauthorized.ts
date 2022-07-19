import { BaseHttpError } from './BaseHttpError';

/**
 * Represents an UNAUTHORIZED ERROR. The server detected a non logged in client
 */
export class Unauthorized extends BaseHttpError {
  constructor(public message: string = 'Not Authorized') {
    super(message);
    this.statusCode = 403;
  }
}
