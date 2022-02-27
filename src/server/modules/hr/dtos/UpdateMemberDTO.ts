import { BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class UpdateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public error?: BaseErrorDTO;
}
