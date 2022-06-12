import { Result } from './Result';

export function catchKeycloackError(error: any, name: string): any {
  const err = error.response.data;
  if (err.error === 'unknown_error') {
    return Result.fail(`Unknown error.`);
  } else if (err.error === 'HTTP 401 Unauthorized') {
    return Result.fail(`HTTP 401 Unauthorized.`);
  } else if (err.errorMessage.includes('already exists')) {
    return Result.fail(`Organization ${name} already exist.`);
  }
}
