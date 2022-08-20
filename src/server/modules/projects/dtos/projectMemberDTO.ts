import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { beforeDeserialize } from '@/utils/utilities';
import { ProjectDTO } from '@/modules/projects/dtos/projectDTO';
import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';
@JsonObject()
@unique
export class ProjectMemberDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;
  @JsonProperty()
  project: ProjectDTO;
  @JsonProperty()
  member: MemberDTO;
  @JsonProperty()
  role: string;
  @JsonProperty()
  status: string;
  @JsonProperty()
  createdAt: string;
}
@JsonObject()
@unique
export class ProjectMemberBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ProjectMemberDTO,
    beforeDeserialize,
  })
  data: Array<ProjectMemberDTO>;
}

@JsonObject()
@unique
export class ProjectMemberRequestDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ProjectMemberBodyDTO;
}

@JsonObject()
@unique
export class CreateProjectMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectMemberDTO;
}

@JsonObject()
@unique
export class ProjectMembersCreateBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ProjectMemberDTO,
    beforeDeserialize,
  })
  data: Array<ProjectMemberDTO>;
}

@JsonObject()
@unique
export class ProjectMembersCreateDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ProjectMembersCreateBodyDTO;
}

@JsonObject()
@unique
export class UpdateProjectMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: ProjectMemberDTO;
}
