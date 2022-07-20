import { HttpError } from 'typescript-rest/dist/server/model/errors';
import { Replacements } from 'i18n';

export type Vars = number | Replacements;

/**
 * The Base class for all HTTP errors
 */
export class BaseHttpError extends HttpError {
  statusCode: number;
  isOperational: boolean;
  variables: Vars;
  constructor(public message: string, variables: Vars = null, isOperational = false) {
    super('', message);
    this.name = this.constructor.name;
    this.variables = variables;
    this.isOperational = isOperational;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }
}
