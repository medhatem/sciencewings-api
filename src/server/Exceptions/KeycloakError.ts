import { BaseHttpError, ErrorParamsOptions } from './BaseHttpError';

export class KeycloakError extends BaseHttpError {
  constructor(message: string, params: ErrorParamsOptions = {}) {
    super(message, params);
  }
}
