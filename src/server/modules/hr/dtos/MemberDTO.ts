import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
export class MemberBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;
}

@Serializable()
@unique
export class MemberDTO extends BaseRequestDTO {
  @JsonProperty()
  body: MemberBodyDTO;
}

@Serializable()
@unique
class CreateMemberBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@Serializable()
@unique
export class CreateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: CreateMemberBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
@unique
export class UpdateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public error?: BaseErrorDTO;
}
