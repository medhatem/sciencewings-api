import { BaseHttpError, ErrorParamsOptions } from './BaseHttpError';

/**
 * Represents an INTERNAL SERVER error. The server encountered an unexpected condition
 * which prevented it from fulfilling the request.
 */
export class InternalServerError extends BaseHttpError {
  constructor(message: string, params: ErrorParamsOptions = {}) {
    super(message, params);
  }
}
