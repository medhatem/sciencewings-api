import { BaseHttpError, ErrorParamsOptions } from './BaseHttpError';

export class BadRequest extends BaseHttpError {
  constructor(message: string, params: ErrorParamsOptions = {}) {
    super(message, { ...params, statusCode: 400 });
  }
}
