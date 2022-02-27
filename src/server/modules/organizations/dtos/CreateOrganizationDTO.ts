import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/Unique';

@Serializable()
@unique
export class RegisterUserFromTokenBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class CreateOrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: RegisterUserFromTokenBodyDTO = new RegisterUserFromTokenBodyDTO();

  @JsonProperty()
  public error?: BaseErrorDTO;
}
