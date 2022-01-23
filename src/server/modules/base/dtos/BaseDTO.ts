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
export class BaseRequestDTO {
  @include()
  public body?: BaseBodyDTO;

  @include()
  public error?: BaseErrorDTO;
}

@dto()
export class BaseDTO {
  @include()
  id: number;
  @include()
  createdAt: Date;
  @include()
  updatedAt: Date;
}
