import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { PaginationBodyDTO } from '@/modules/organizations/dtos/GetOrganizationsMembersDTO';

@JsonObject()
export class GroupBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  organization: OrganizationDTO;

  @JsonProperty({
    type: MemberDTO,
    beforeDeserialize,
  })
  members?: Array<MemberDTO>;

  @JsonProperty()
  description: string;
}

@JsonObject()
@unique
class GroupBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class GroupDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GroupBodyDTO;
}

@JsonObject()
@unique
export class OrgGroupsDTO extends BaseBodyDTO {
  @JsonProperty({ type: GroupBodyDTO, beforeDeserialize })
  data: Array<GroupBodyDTO>;
  @JsonProperty()
  pagination?: PaginationBodyDTO;
}

@JsonObject()
@unique
export class OrgGroupsrequestDTO extends BaseRequestDTO {
  @JsonProperty()
  body?: OrgGroupsDTO;
}

@JsonObject()
@unique
export class CreateGroupDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: GroupBaseBodyGetDTO;
}

@JsonObject()
@unique
export class UpdateGroupDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: GroupBaseBodyGetDTO;
}
