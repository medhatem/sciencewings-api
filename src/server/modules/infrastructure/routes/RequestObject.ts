import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { MemberKey } from '@/types/types';

@JsonObject()
@unique
export class InfrustructureRO {
  @JsonProperty()
  name!: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  key!: number;

  @JsonProperty()
  responsables?: Array<MemberKey>;

  @JsonProperty()
  parent?: number;

  @JsonProperty()
  resources!: Array<number>;

  @JsonProperty()
  organization!: number;
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
  responsables?: Array<number>;

  @JsonProperty()
  parent?: number;

  @JsonProperty()
  resources?: Array<number>;

  @JsonProperty()
  organization?: number;
}
