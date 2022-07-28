import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { beforeDeserialize } from '@/utils/utilities';
import { OrganizationInformationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';

@JsonObject()
@unique
export class ProjectDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;

  @JsonProperty()
  title?: string;

  @JsonProperty()
  key?: string;

  @JsonProperty()
  description?: string;

  @JsonProperty({
    type: MemberDTO,
    beforeDeserialize,
  })
  members?: Array<MemberDTO>;

  @JsonProperty()
  active?: boolean;

  @JsonProperty()
  dateStart?: Date;

  @JsonProperty()
  dateEnd?: Date;

  @JsonProperty({
    type: OrganizationInformationDTO,
    beforeDeserialize,
  })
  organization?: OrganizationInformationDTO;
}
@JsonObject()
@unique
export class GETProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectDTO;
}

@JsonObject()
@unique
export class CreateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectDTO;
}

@JsonObject()
@unique
export class UpdateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectDTO;
}

@JsonObject()
@unique
export class ProjectGetBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ProjectDTO,
    beforeDeserialize,
  })
  data: Array<ProjectDTO>;
}
@JsonObject()
@unique
export class ProjectGetDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ProjectGetBodyDTO;
}
