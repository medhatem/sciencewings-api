import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
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
  apartment?: string;
}
