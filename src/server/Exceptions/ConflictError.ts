import { BaseHttpError } from './BaseHttpError';

/**
 * Represents a CONFLICT SERVER ERROR.the request could not be processed
 * because of conflict in the request, such as the requested resource is not in the expected state
 * or the result of processing the request would create a conflict within the resource.
 */
export class ConflictError extends BaseHttpError {
  constructor(message: string) {
    super(message);
    this.isOperational = true;
    this.statusCode = 409;
  }
}
