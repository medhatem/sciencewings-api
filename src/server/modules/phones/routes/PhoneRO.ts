import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class PhoneRO {
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
