import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class RegisterUserFromTokenBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateOrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: RegisterUserFromTokenBodyDTO = new RegisterUserFromTokenBodyDTO();

  @JsonProperty()
  public error?: BaseErrorDTO;
}
