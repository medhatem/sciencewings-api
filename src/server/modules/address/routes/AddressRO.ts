import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressType } from '@/modules/address/models/Address';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class AddressRO {
  @JsonProperty()
  country: string;

  @JsonProperty()
  province: string;

  @JsonProperty()
  code: string;

  @JsonProperty()
  type: AddressType;

  @JsonProperty()
  city: string;

  @JsonProperty()
  street: string;

  @JsonProperty()
  apartment?: string;

  @JsonProperty()
  user?: number;

  @JsonProperty()
  organization?: number;
}
