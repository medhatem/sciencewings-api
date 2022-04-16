import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { UserDTO } from '@/modules/users/dtos/UserDTO';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';

@JsonObject()
export class MemberBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;

  @JsonProperty()
  user: UserDTO;

  @JsonProperty()
  organization: OrganizationDTO;
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
