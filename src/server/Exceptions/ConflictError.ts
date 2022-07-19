import { BaseHttpError, Vars } from './BaseHttpError';

/**
 * Represents a CONFLICT SERVER ERROR.the request could not be processed
 * because of conflict in the request, such as the requested resource is not in the expected state
 * or the result of processing the request would create a conflict within the resource.
 */
export class ConflictError extends BaseHttpError {
  constructor(message: string, variables: Vars = null, isOperational = true) {
    super(message, variables, isOperational);
    this.statusCode = 409;
  }
}
