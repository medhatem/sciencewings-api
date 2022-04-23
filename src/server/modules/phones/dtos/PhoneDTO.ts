import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';

@JsonObject()
@unique
export class PhoneBaseBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class PhoneDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: PhoneBaseBodyDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
