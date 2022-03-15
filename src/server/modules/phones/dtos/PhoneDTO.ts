import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
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
