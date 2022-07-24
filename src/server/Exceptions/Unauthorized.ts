import { BaseHttpError, ErrorParamsOptions } from './BaseHttpError';

/**
 * Represents an UNAUTHORIZED ERROR. The server detected a non logged in client
 */
export class Unauthorized extends BaseHttpError {
  constructor(public message: string = 'Not Authorized', params: ErrorParamsOptions = {}) {
    super(message, { ...params, statusCode: 403 });
    this.statusCode = 403;
  }
}
