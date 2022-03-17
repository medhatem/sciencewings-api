import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address';
import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class UserIdDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  createdAt: Date;

  @JsonProperty()
  updatedAt: Date;

  @JsonProperty()
  dateofbirth: Date;

  @JsonProperty()
  email: string;

  @JsonProperty()
  firstname: string;

  @JsonProperty()
  lastname: string;

  @JsonProperty()
  keycloakId: string;

  @JsonProperty({ type: PhoneDTO })
  phone: Array<PhoneDTO>;

  @JsonProperty({
    type: AddressDTO,
    name: 'address',
  })
  addresses: Array<AddressDTO>;
}

@Serializable()
@unique
export class ResetDTO extends BaseBodyDTO {
  @JsonProperty()
  message: string;
}

@Serializable()
@unique
export class ErrorDTO extends BaseErrorDTO {}

@Serializable()
@unique
export class RegisterUserFromTokenDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO;

  @JsonProperty()
  error?: BaseErrorDTO;
}

@Serializable()
@unique
export class ResetPasswordDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: ResetDTO;

  @JsonProperty()
  error?: BaseErrorDTO;
}
