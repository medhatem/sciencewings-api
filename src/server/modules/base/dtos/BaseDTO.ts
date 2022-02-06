import { Class, IMapper, buildMapper, dto, include } from 'dto-mapper';

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
  getMapper<T extends BaseRequestDTO>(): IMapper<T, unknown> {
    return buildMapper<unknown, T>((this.constructor as any) as Class<T>);
  }

  serialize(payload: { [key: string]: any }): this {
    return this.getMapper<this>().serialize<this>(payload as any);
  }

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
