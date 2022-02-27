import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@unique
class BodyUpdateUserDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@unique
@Serializable()
export class UpdateUserDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BodyUpdateUserDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
