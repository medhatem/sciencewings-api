import { unique } from '@/decorators/unique';
import { BaseBodyDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

@JsonObject()
@unique
export class ResourceStatusDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  statusType: string;

  @JsonProperty()
  statusDescription: string;
}
