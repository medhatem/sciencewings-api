import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class ProjectTagRO {
  @JsonProperty()
  title: string;
}

@JsonObject()
@unique
export class ProjectTaskRO {
  @JsonProperty()
  title: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  assigned: number;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  priority: string;

  @JsonProperty()
  dateStart: Date;

  @JsonProperty()
  dateEnd: Date;

  @JsonProperty()
  public parent?: number;

  @JsonProperty()
  completed: boolean;

  @JsonProperty()
  project: number;

  @JsonProperty()
  projectTask: number;

  @JsonProperty()
  reporter: number;
}

@JsonObject()
@unique
export class ProjectMemberRo {
  @JsonProperty()
  orgId: number;

  @JsonProperty()
  userId: number;

  @JsonProperty()
  status: string;

  @JsonProperty()
  role: string;
}

@JsonObject()
@unique
export class listMembersRo {
  @JsonProperty()
  listMembers: ProjectMemberRo[];
}

@JsonObject()
@unique
export class ProjectResponsableRO {
  @JsonProperty()
  userId: number;
  @JsonProperty()
  orgId: number;
}

@JsonObject()
@unique
export class ProjectRO {
  @JsonProperty()
  title: string;

  @JsonProperty()
  key: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  dateStart: Date;

  @JsonProperty()
  dateEnd?: Date;

  @JsonProperty()
  organization: number;
}

@JsonObject()
@unique
export class UpdateProjectRO {
  @JsonProperty()
  title?: string;

  @JsonProperty()
  key?: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  active?: boolean;

  @JsonProperty()
  dateStart?: Date;

  @JsonProperty()
  dateEnd?: Date;
}

@JsonObject()
@unique
export class UpdateProjectParticipantRO {
  @JsonProperty()
  orgId: number;

  @JsonProperty()
  userId: number;

  @JsonProperty()
  status: string;

  @JsonProperty()
  role: string;
}
