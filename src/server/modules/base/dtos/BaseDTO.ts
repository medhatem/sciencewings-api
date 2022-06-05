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
    const filtredPayload = { ...payload };
    if (filtredPayload.body.data) {
      filtredPayload.body.data = payload.body.data.toArray().map((el: any) => {
        console.log({ '-------------': el instanceof Date });
        for (const key in el) {
          if (el[key] instanceof Date) {
            el[key] = el[key].toISOString();
          }
        }

        return el;
      });
    }

    const deserialized: any = new JsonSerializer().deserialize<this>(
      filtredPayload as any,
      this.constructor as any,
    ) as this;

    return deserialized;
  }

  @JsonProperty()
  public body?: BaseBodyDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
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
