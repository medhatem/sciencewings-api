import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { OrganizationInformationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { ProjectTagBaseBodyGetDTO } from './projectTagDTO';
import { ProjectTaskDTO } from './projectTaskDTO';
import { ProjectBoardBaseBodyGetDTO } from './projectBoardDto';

@JsonObject()
@unique
export class ProjectDTO extends BaseRequestDTO {}

@JsonObject()
@unique
export class ProjectBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  title: string;

  @JsonProperty()
  description: string;

  @JsonProperty({
    type: MemberDTO,
    beforeDeserialize,
  })
  managers: Array<MemberDTO>;
  @JsonProperty({
    type: MemberDTO,
    beforeDeserialize,
  })
  participants: Array<MemberDTO>;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  dateStart: Date;

  @JsonProperty()
  dateEnd?: Date;

  @JsonProperty({
    type: ProjectTagBaseBodyGetDTO,
    beforeDeserialize,
  })
  projectTags?: Array<ProjectTagBaseBodyGetDTO>;

  @JsonProperty({
    type: ProjectTaskDTO,
    beforeDeserialize,
  })
  ProjectTask?: Array<ProjectTaskDTO>;

  @JsonProperty({
    type: ProjectBoardBaseBodyGetDTO,
    beforeDeserialize,
  })
  projectBoard?: Array<ProjectBoardBaseBodyGetDTO>;

  @JsonProperty({
    type: OrganizationInformationDTO,
    beforeDeserialize,
  })
  organizations?: Array<OrganizationInformationDTO>;
}

@JsonObject()
@unique
export class CreateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class UpdateProjectDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@JsonObject()
@unique
export class getAllProjectsBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ProjectBaseBodyGetDTO,
    beforeDeserialize,
  })
  data: Array<ProjectBaseBodyGetDTO>;
}
@JsonObject()
@unique
export class getProjectsDTO extends BaseRequestDTO {
  @JsonProperty()
  body: getAllProjectsBodyDTO;
}
