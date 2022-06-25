import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { beforeDeserialize } from '@/utils/utilities';

@JsonObject()
@unique
class UserOrganizationBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: number;
}

@JsonObject()
@unique
class UserOrganizationsGetDTO extends BaseBodyDTO {
  @JsonProperty({
    type: UserOrganizationBaseBodyGetDTO,
    beforeDeserialize,
  })
  organizations: Array<UserOrganizationBaseBodyGetDTO>;
}

@JsonObject()
@unique
export class UserOrganizationsDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: UserOrganizationsGetDTO;
}
