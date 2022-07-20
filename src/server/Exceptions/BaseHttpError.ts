import { HttpError } from 'typescript-rest/dist/server/model/errors';
import { Replacements } from 'i18n';

export type Vars = number | Replacements;

export interface ErrorParamsOptions {
  friendly?: boolean;
  variables?: Vars;
  isOperational?: boolean;
  statusCode?: number;
}

/**
 * The Base class for all HTTP errors
 */
export class BaseHttpError extends HttpError {
  statusCode: number;
  isOperational: boolean;
  variables: Vars;
  // determines if the error is a client friendly error
  // if so then it means the client can display the error as is
  friendly: boolean;
  constructor(
    public message: string,
    { friendly = false, variables = null, isOperational = true, statusCode = 500 }: ErrorParamsOptions,
  ) {
    super('', message);
    this.name = this.constructor.name;
    this.variables = variables;
    this.isOperational = isOperational;
    this.friendly = friendly;
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }
}
