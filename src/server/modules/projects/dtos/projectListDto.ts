import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { unique } from '@/decorators/unique';
import { beforeDeserialize } from '@/utils/utilities';
import { MemberDTO } from '@/modules/hr';
import { ProjectDTO } from '@/modules/projects/dtos/projectDTO';

@JsonObject()
@unique
export class ResponsableObjectDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;
  @JsonProperty()
  member: MemberDTO;
  @JsonProperty()
  name: string;
  @JsonProperty()
  email: string;
}

@JsonObject()
@unique
export class ProjectListDTO extends BaseBodyDTO {
  @JsonProperty()
  id?: number;
  @JsonProperty()
  title: string;
  @JsonProperty()
  responsable: ResponsableObjectDTO;
  @JsonProperty()
  members: number;
  @JsonProperty()
  creatingDate: string;
  @JsonProperty()
  projectDto: ProjectDTO;
}
@JsonObject()
@unique
export class ProjectListBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ProjectListDTO,
    beforeDeserialize,
  })
  data: Array<ProjectListDTO>;
}

@JsonObject()
@unique
export class ProjectListRequestDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ProjectDTO;
}
