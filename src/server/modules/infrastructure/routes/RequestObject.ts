import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class InfrastructureRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  key: string;

  @JsonProperty()
  responsible?: number;

  @JsonProperty()
  parent?: number;

  @JsonProperty()
  resources?: Array<number>;

  @JsonProperty()
  organization: number;
}
@JsonObject()
@unique
export class UpdateinfrastructureRO {
  @JsonProperty()
  name?: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  key?: number;

  @JsonProperty()
  responsible?: number;

  @JsonProperty()
  parent?: number;

  @JsonProperty()
  resources?: Array<number>;

  @JsonProperty()
  organization?: number;
}
