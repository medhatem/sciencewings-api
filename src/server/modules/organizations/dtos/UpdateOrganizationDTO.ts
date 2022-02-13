import { Organization } from './../models/Organization';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '../../base/dtos/BaseDTO';

class BodyUpdateOrganizationDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class UpdateOrganizationDTO extends BaseRequestDTO<Organization> {
  @JsonProperty()
  public body?: BodyUpdateOrganizationDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
