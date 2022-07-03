import {
  BadRequestError,
  ForbiddenError,
  HttpError,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  NotImplementedError,
  UnauthorizedError,
} from 'typescript-rest/dist/server/model/errors';

import { Logger } from './Logger';

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public bubble: boolean;
  public error: HttpError;
  private _value: T;
  public logger: Logger;

  private constructor(isSuccess: boolean, error?: HttpError, value?: T, bubble: boolean = false) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
          successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
          needs to contain an error message`);
    }
    if (!isSuccess && error) {
      //log the error
      Logger.getInstance().error(error.message);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
    this.bubble = bubble;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`);
    }

    return this._value;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string, bubble: boolean = false): Result<U> {
    return new Result<U>(false, new InternalServerError(error), null, bubble);
  }
  public static notFound<U>(error: string, bubble: boolean = false): Result<U> {
    return new Result<U>(false, new NotFoundError(error), null, bubble);
  }
  public static badRequestError<U>(error: string, bubble: boolean = false): Result<U> {
    return new Result<U>(false, new BadRequestError(error), null, bubble);
  }
  public static forbiddenError<U>(error: string, bubble: boolean = false): Result<U> {
    return new Result<U>(false, new ForbiddenError(error), null, bubble);
  }
  public static unauthorizedError<U>(error: string, bubble: boolean = false): Result<U> {
    return new Result<U>(false, new UnauthorizedError(error), null, bubble);
  }
  public static notImplementedError<U>(error: string, bubble: boolean = false): Result<U> {
    return new Result<U>(false, new NotImplementedError(error), null, bubble);
  }
  public static methodNotAllowedError<U>(error: string, bubble: boolean = false): Result<U> {
    return new Result<U>(false, new MethodNotAllowedError(error), null, bubble);
  }
  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>();
  }
}
