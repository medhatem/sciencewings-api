import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { OrganizationBaseBodyGetDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { UserBaseBodyGetDTO } from '@/modules/users/dtos/UserDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class MemberBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  user: UserBaseBodyGetDTO;

  @JsonProperty()
  organization: OrganizationBaseBodyGetDTO;

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
export class UpdateMemberBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  userId: number;
  @JsonProperty()
  orgId: number;
}

@JsonObject()
@unique
export class UpdateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: UpdateMemberBodyDTO;
  @JsonProperty()
  public error?: BaseErrorDTO;
}
@JsonObject()
export class getMembershipBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;
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
