import { BaseHttpError, Vars } from './BaseHttpError';

export class KeycloakError extends BaseHttpError {
  constructor(message: string, variables: Vars = null, isOperational = false) {
    super(message, variables, isOperational);
    this.statusCode = 500;
  }
}
