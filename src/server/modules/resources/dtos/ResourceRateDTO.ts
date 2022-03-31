import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, JsonObject } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class ResourceRateDTO extends BaseBodyDTO {
  @JsonProperty()
  description: string;

  @JsonProperty()
  rate: number;

  @JsonProperty()
  category: string;

  @JsonProperty()
  isPublic: boolean;

  @JsonProperty()
  isRequiredAccountNumber: boolean;

  @JsonProperty()
  duration: number;
}

@JsonObject()
@unique
export class CreateResourceRateDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ResourceRateDTO;
}
