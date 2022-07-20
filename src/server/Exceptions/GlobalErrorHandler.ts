import { container, provideSingleton } from '@/di';

import { BaseHttpError } from './BaseHttpError';
import { KeycloakError } from './KeycloakError';
import { LocaleService } from './i18n/LocaleService';
import { Logger } from '@/utils/Logger';

/**
 * Error handler class that takes care of logging and translating different errors
 * into different languages
 * a human readable error is then sent back to the client
 *
 */
@provideSingleton()
export class ErrorHandler {
  constructor(private logger: Logger, private localService: LocaleService) {}

  static getInstance(): ErrorHandler {
    return container.get(ErrorHandler);
  }

  handle(error: BaseHttpError | Error, language: string) {
    this.localService.setLocale(language);

    const { response } = error as any;
    // check if the error is keycloak based error
    if (response) {
      let keycloakErr = new KeycloakError('SOMETHING_WENT_WRONG');
      if (response.data) {
        if (response.data?.error === 'HTTP 401 Unauthorized') {
          keycloakErr.statusCode = 401;
          keycloakErr.message = 'HTTP_401_UNAUTHORIZED';
        } else if (response.data?.errorMessage?.includes('already exists')) {
          //extract the name of the resource that already exist
          const extractedName = new RegExp(/(?<=-)([\w]*)/g).exec(response.data.errorMessage);
          keycloakErr = new KeycloakError('{{name}} ALREADY_EXISTS', { name: extractedName[0] }, true);
          keycloakErr.statusCode = response.status;
        }
      }
      this.logger.error(
        `Operational with name KeycloakError and code ${keycloakErr.statusCode} with message ${
          response.data?.errorMessage || response.data?.error || 'undefined'
        } 
            stackTrace: ${error.stack}`,
      );
      return {
        error: this.localService.translate(keycloakErr.message, keycloakErr.variables),
        statusCode: keycloakErr.statusCode || 500,
        isOperational: keycloakErr.isOperational || false,
      };
    }

    // check if the error is a known Error class
    if (error instanceof BaseHttpError) {
      const oldMessage = error.message;
      error.message = this.localService.getMessageInEn(error.message, error.variables);
      this.logger.error(
        `${error.isOperational ? 'Operational' : 'Non Operational'} with name ${error.name} and code ${error.statusCode}
        stackTrace: ${error.stack}`,
      );

      if (error.isOperational) {
        return {
          error: this.localService.translate(oldMessage, error.variables),
          statusCode: error.statusCode,
          isOperational: true,
        };
      }
    } else {
      this.logger.error(`Non Operational with name Internal Server Error and code 500 stackTrace: ${error.stack}`);
    }

    return { error: this.localService.translate('SOMETHING_WENT_WRONG'), statusCode: 500, isOperational: false };
  }
}
