import { dto, include } from 'dto-mapper';

@dto()
export class BaseBodyDTO {
  @include()
  statusCode: number;
}

@dto()
export class BaseErrorDTO {
  @include()
  statusCode: number;

  @include()
  errorMessage: string;
}

@dto()
export class BaseDTO {
  @include()
  public body?: BaseBodyDTO;

  @include()
  public error?: BaseErrorDTO;
}
