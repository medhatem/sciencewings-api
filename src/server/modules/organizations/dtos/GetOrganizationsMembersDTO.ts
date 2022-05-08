import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { MemberBodyDTO } from '@/modules/hr/dtos/MemberDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
class OrganizationMembersBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: MemberBodyDTO,
    beforeDeserialize,
  })
  members: Array<MemberBodyDTO>;
}

@JsonObject()
@unique
export class OrganizationMembersDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: OrganizationMembersBodyDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
