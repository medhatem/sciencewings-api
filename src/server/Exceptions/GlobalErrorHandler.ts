import { container, provideSingleton } from '@/di';

import { BaseHttpError } from './BaseHttpError';
import { Logger } from '@/utils/Logger';

@provideSingleton()
export class ErrorHandler {
  constructor(private logger: Logger) {}

  static getInstance(): ErrorHandler {
    return container.get(ErrorHandler);
  }

  handle(error: BaseHttpError | Error) {
    const { response } = error as any;
    if (response) {
      this.logger.error(
        `Operational with name KeycloakError and code ${response.status} 
            stackTrace: ${error.stack}`,
      );
      let statusCode: number;
      let message: string;
      //check if the error is a keycloak based error
      if (response.data) {
        if (response.data?.error === 'unknown_error') {
          message = 'Something went wrong';
        } else if (response.data?.error === 'HTTP 401 Unauthorized') {
          statusCode = 401;
          message = 'HTTP 401 Unauthorized';
        } else if (response.data?.errorMessage?.includes('already exists')) {
          //extract the name of the resource that already exist
          const extractedName = new RegExp(/(?<=-)([\w]*)/g).exec(response.data.errorMessage);
          message = `${extractedName[0]} already exist.`;
          statusCode = response.status;
        } else {
          message = 'Something went wrong';
        }
      }
      return { error: message, statusCode: statusCode || 500, isOperational: true };
    }

    if (error instanceof BaseHttpError) {
      this.logger.error(
        `${error.isOperational ? 'Operational' : 'Non Operational'} with name ${error.name} and code ${error.statusCode}
        stackTrace: ${error.stack}`,
      );

      if (error.isOperational) {
        return { error: error.message, statusCode: error.statusCode, isOperational: true };
      }
    } else {
      this.logger.error(`Non Operational with name Internal Server Error and code 500 stackTrace: ${error.stack}`);
    }

    return { error: 'Something went wrong', statusCode: 500, isOperational: false };
  }
}
