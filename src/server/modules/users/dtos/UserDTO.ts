import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address/dtos/AddressDTO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@unique
@JsonObject()
export class UserBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  firstname: string;

  @JsonProperty()
  lastname: string;

  @JsonProperty()
  email: string;

  @JsonProperty({
    type: PhoneRO,
    name: 'phone',
    beforeDeserialize,
  })
  phones: Array<PhoneRO>;

  @JsonProperty({
    type: AddressDTO,
    name: 'address',
    beforeDeserialize,
  })
  addresses: Array<AddressDTO>;

  @JsonProperty()
  keycloakId: string;
}

@unique
@JsonObject()
export class UserDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: UserBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
