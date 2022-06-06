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
  dateEnd?: Date;

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
export class ProjectRO {
  @JsonProperty()
  title: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  managers: number[];

  @JsonProperty()
  participants: number[];

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  dateStart: Date;

  @JsonProperty()
  dateEnd?: Date;

  @JsonProperty()
  tags: ProjectTagRO[];

  @JsonProperty()
  tasks: ProjectTaskRO[];

  @JsonProperty()
  organization: number;
}
