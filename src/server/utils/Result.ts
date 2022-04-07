import { Logger } from './Logger';
import {
  InternalServerError,
  NotFoundError,
  HttpError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  NotImplementedError,
  MethodNotAllowedError,
} from 'typescript-rest/dist/server/model/errors';
export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: string | HttpError;
  private _value: T;
  public logger: Logger;

  private constructor(isSuccess: boolean, error?: string | HttpError, value?: T) {
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
      Logger.getInstance().error(error as string);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

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

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, new InternalServerError(error), null);
  }
  public static notFound<U>(error: string): Result<U> {
    return new Result<U>(false, new NotFoundError(error), null);
  }
  public static badRequestError<U>(error: string): Result<U> {
    return new Result<U>(false, new BadRequestError(error), null);
  }
  public static forbiddenError<U>(error: string): Result<U> {
    return new Result<U>(false, new ForbiddenError(error), null);
  }
  public static unauthorizedError<U>(error: string): Result<U> {
    return new Result<U>(false, new UnauthorizedError(error), null);
  }
  public static notImplementedError<U>(error: string): Result<U> {
    return new Result<U>(false, new NotImplementedError(error), null);
  }
  public static methodNotAllowedError<U>(error: string): Result<U> {
    return new Result<U>(false, new MethodNotAllowedError(error), null);
  }
  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>();
  }
}
