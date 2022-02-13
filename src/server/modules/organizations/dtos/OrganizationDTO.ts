import { Organization } from './../models/Organization';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { BaseRequestDTO, BaseBodyDTO, BaseErrorDTO } from '../../base/dtos/BaseDTO';

@Serializable()
class BaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;

  @JsonProperty()
  parent: any;
}

@Serializable()
export class OrganizationDTO extends BaseRequestDTO<Organization> {
  @JsonProperty()
  public body?: BaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
