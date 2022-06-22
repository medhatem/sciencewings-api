import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';

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
  @JsonProperty()
  organizations: UserOrganizationBaseBodyGetDTO[];
}

@JsonObject()
@unique
export class UserOrganizationsDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: UserOrganizationsGetDTO;
}
