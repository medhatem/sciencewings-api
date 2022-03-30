import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class PhoneDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  phoneLabel: string;

  @JsonProperty()
  phoneCode: string;

  @JsonProperty()
  phoneNumber: string;
}
