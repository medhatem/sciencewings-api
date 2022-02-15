import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { Organization } from './../models/Organization';

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
