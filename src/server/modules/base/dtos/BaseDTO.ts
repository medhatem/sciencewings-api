import { BaseModel } from './../models/BaseModel';
import { deserialize, serialize, JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class BaseBodyDTO {
  @JsonProperty()
  statusCode: number;
}

@Serializable()
export class BaseErrorDTO {
  @JsonProperty()
  statusCode: number;

  @JsonProperty()
  errorMessage: string;
}

@Serializable()
export class BaseRequestDTO<T extends BaseModel<T>> {
  // getMapper<T extends BaseRequestDTO>(): IMapper<T, unknown> {
  //   return buildMapper<unknown, T>(this.constructor as any as Class<T>);
  // }

  serialize(payload: { [key: string]: any }): this {
    return serialize(payload as any);
  }

  deserialize(model: T, payload: any): any {
    return deserialize<T>(payload as any, model as any);
  }

  @JsonProperty()
  public body?: BaseBodyDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
export class BaseDTO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  createdAt: Date;
  @JsonProperty()
  updatedAt: Date;
}
