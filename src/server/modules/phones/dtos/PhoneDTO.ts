import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class PhoneDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  label: string;

  @JsonProperty()
  code: string;

  @JsonProperty()
  number: string;

  @JsonProperty()
  userId?: number;

  @JsonProperty()
  organizationId?: number;
}
