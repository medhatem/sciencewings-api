import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class ProjectTagRO {
  @JsonProperty()
  title: string;
}

@Serializable()
@unique
export class ProjectTaskRO {
  @JsonProperty()
  title: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  assigned: number[];

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
}

@Serializable()
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
  public tags: ProjectTagRO[];

  @JsonProperty()
  public tasks: ProjectTaskRO[];

  @JsonProperty()
  public organization: number;
}
