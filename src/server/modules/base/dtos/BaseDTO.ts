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

  deserialize(payload: { [key: string]: any }): this {
    return deserialize<this>(payload as any, this.constructor as any);
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
