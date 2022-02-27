import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
class OrganizationBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;

  @JsonProperty()
  parent: any;
}

@Serializable()
@unique
export class OrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: OrganizationBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
