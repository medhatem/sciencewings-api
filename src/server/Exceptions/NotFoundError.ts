import { BaseHttpError, Vars } from './BaseHttpError';

/**
 * Represents a NOT FOUND error. The server has not found anything matching
 * the Request-URI. No indication is given of whether the condition is temporary
 * or permanent. The 410 (GoneError) status code SHOULD be used if the server knows,
 * through some internally configurable mechanism, that an old resource is permanently
 * unavailable and has no forwarding address.
 *
 * This error is commonly used when
 * the server does not wish to reveal exactly why the request has been refused,
 * or when no other response is applicable.
 */
export class NotFoundError extends BaseHttpError {
  constructor(message: string, variables: Vars = null, isOperational = true) {
    super(message, variables, isOperational);
    this.statusCode = 404;
  }
}
