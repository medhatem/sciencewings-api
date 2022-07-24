import { BaseHttpError, ErrorParamsOptions } from './BaseHttpError';

/**
 * Represents a VALIDATION ERROR. The server encountered wrong client sent data
 * which prevented it from fulfilling a specific request.
 */
export class ValidationError extends BaseHttpError {
  constructor(message: string, params: ErrorParamsOptions = {}) {
    super(message, { ...params, statusCode: 400 });
    this.statusCode = 400;
  }
}
