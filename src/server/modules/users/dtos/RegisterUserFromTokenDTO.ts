import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address/dtos/AddressDTO';
import { PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@JsonObject()
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

  @JsonProperty({ type: PhoneDTO, beforeDeserialize })
  phone: Array<PhoneDTO>;

  @JsonProperty({
    type: AddressDTO,
    beforeDeserialize,
    name: 'address',
  })
  addresses: Array<AddressDTO>;
}

@JsonObject()
@unique
export class ResetDTO extends BaseBodyDTO {
  @JsonProperty()
  message: string;
}

@JsonObject()
@unique
export class ErrorDTO extends BaseErrorDTO {}

@JsonObject()
@unique
export class RegisterUserFromTokenDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: UserIdDTO;

  @JsonProperty()
  error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class ResetPasswordDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: ResetDTO;

  @JsonProperty()
  error?: BaseErrorDTO;
}
