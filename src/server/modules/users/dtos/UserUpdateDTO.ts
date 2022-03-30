import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@unique
class BodyUpdateUserDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@unique
@JsonObject()
export class UpdateUserDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: BodyUpdateUserDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
