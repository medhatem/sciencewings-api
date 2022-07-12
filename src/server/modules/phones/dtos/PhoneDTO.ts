import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class PhoneInformationDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  phoneLabel: string;
  @JsonProperty()
  phoneCode: string;
  @JsonProperty()
  phoneNumber: string;
}

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
}
