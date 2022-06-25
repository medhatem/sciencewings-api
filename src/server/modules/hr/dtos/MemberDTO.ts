import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { UserDTO } from '@/modules/users/dtos/UserDTO';
import { OrganizationBaseBodyGetDTO, OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { beforeDeserialize } from '@/utils/utilities';

@JsonObject()
@unique
export class MemberBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  user: UserDTO;

  @JsonProperty()
  organization: OrganizationDTO;

  @JsonProperty()
  status: string;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  joinDate: Date;

  @JsonProperty()
  workEmail: string;
}

@JsonObject()
@unique
export class MemberDTO extends BaseRequestDTO {
  @JsonProperty()
  body: MemberBodyDTO;
}

@JsonObject()
@unique
class CreateMemberBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: CreateMemberBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public error?: BaseErrorDTO;
}
@JsonObject()
export class getMembershipBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  organization: OrganizationBaseBodyGetDTO;

  @JsonProperty()
  membership: string;
}
@JsonObject()
@unique
export class getAllMembershipsBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: getMembershipBodyDTO,
    beforeDeserialize,
  })
  data: Array<getMembershipBodyDTO>;
}
@JsonObject()
@unique
export class getMembershipDTO extends BaseRequestDTO {
  @JsonProperty()
  body: getAllMembershipsBodyDTO;
}
