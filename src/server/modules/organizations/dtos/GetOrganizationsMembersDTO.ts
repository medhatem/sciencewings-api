import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { MemberBodyDTO } from '@/modules/hr/dtos/MemberDTO';
import { unique } from '@/decorators/unique';

@Serializable()
@unique
class OrganizationMembersBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: MemberBodyDTO,
  })
  members: Array<MemberBodyDTO>;
}

@Serializable()
@unique
export class OrganizationMembersDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: OrganizationMembersBodyDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
