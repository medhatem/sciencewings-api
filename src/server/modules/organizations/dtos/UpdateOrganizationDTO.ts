import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

class BodyUpdateOrganizationDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
export class UpdateOrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BodyUpdateOrganizationDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
