import { JsonProperty, Serializable, deserialize, serialize } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class BaseBodyDTO {
  @JsonProperty()
  statusCode: number;
}

@Serializable()
@unique
export class BaseErrorDTO {
  @JsonProperty()
  statusCode: number;

  @JsonProperty()
  errorMessage: string;
}

@Serializable()
@unique
export class BaseRequestDTO {
  serialize(payload: { [key: string]: any }): this {
    return serialize(payload as any);
  }

  deserialize<T extends BaseRequestDTO>(model: T, payload: any): any {
    return deserialize<T>(payload as any, model as any);
  }

  @JsonProperty()
  public body?: BaseBodyDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
@unique
export class BaseDTO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  createdAt: Date;
  @JsonProperty()
  updatedAt: Date;
}
