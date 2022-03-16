import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

@unique
@Serializable()
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
  })
  phones: Array<PhoneRO>;

  @JsonProperty({
    type: AddressDTO,
    name: 'address',
  })
  addresses: Array<AddressDTO>;

  @JsonProperty()
  keycloakId: string;
}

@unique
@Serializable()
export class UserDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: UserBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
