import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';

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

  @JsonProperty()
  member?: Array<MemberDTO>;

  @JsonProperty()
  note: string;
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
export class CreateGroupDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: GroupBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateGroupDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: GroupBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
