import { JsonObject, JsonProperty, JsonSerializer } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class BaseBodyDTO {
  @JsonProperty()
  statusCode: number;
}

@JsonObject()
@unique
export class BaseErrorDTO {
  @JsonProperty()
  statusCode: number;

  @JsonProperty()
  errorMessage: string;
}

@JsonObject()
@unique
export class BaseRequestDTO {
  constructor(payload?: { [key: string]: any }) {
    if (payload && Object.keys(payload)?.length > 0) {
      const result = this.deserialize(payload);
      Object.assign(this, result);
    }
  }

  serialize(payload: { [key: string]: any }): this {
    return new JsonSerializer().serialize(payload as any) as this;
  }

  deserialize(payload: { [key: string]: any }): this {
    return new JsonSerializer().deserialize<this>(payload as any, this.constructor as any) as this;
  }

  @JsonProperty()
  public body?: BaseBodyDTO;
}

@JsonObject()
@unique
export class BaseDTO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  createdAt: Date;
  @JsonProperty()
  updatedAt: Date;
}
