import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/Unique';

@Serializable()
@unique
class BodyUpdateOrganizationDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class UpdateOrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BodyUpdateOrganizationDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
