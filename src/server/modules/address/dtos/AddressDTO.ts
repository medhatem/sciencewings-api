import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';

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
@JsonObject()
@unique
export class AddressBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class AddressBaseDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: AddressBodyDTO;
}
@JsonObject()
@unique
export class UpdatedAddressDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: AddressBodyDTO;
}
