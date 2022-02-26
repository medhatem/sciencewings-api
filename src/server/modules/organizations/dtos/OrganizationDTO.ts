import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
class OrganizationBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;

  @JsonProperty()
  parent: any;
}

@Serializable()
export class OrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: OrganizationBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
