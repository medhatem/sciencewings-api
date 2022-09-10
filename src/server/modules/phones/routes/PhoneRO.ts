import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class PhoneRO {
  @JsonProperty()
  id?: number;

  @JsonProperty()
  phoneLabel: string;

  @JsonProperty()
  phoneCode: string;

  @JsonProperty()
  phoneNumber: string;

  @JsonProperty()
  userId?: number;

  @JsonProperty()
  organizationId?: number;

  @JsonProperty()
  memberId?: number;
}
