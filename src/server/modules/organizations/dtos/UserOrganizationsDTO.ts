import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
class UserOrganizationBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;
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
