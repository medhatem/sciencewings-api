import { Organization } from './../models/Organization';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';

@Serializable()
export class RegisterUserFromTokenBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class CreateOrganizationDTO extends BaseRequestDTO<Organization> {
  @JsonProperty()
  body?: RegisterUserFromTokenBodyDTO = new RegisterUserFromTokenBodyDTO();

  @JsonProperty()
  public error?: BaseErrorDTO;
}
