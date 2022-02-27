import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/Unique';
@Serializable()
@unique
export class AddressDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  country: string;

  @JsonProperty()
  province: string;

  @JsonProperty()
  code: string;

  @JsonProperty()
  type: string;

  @JsonProperty()
  city: string;

  @JsonProperty()
  street: string;

  @JsonProperty()
  appartement: number;
}
