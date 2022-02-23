import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class ProjectTagRO {
  @Serializable()
  title: string;
}

@Serializable()
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
  date_start: Date;

  @JsonProperty()
  date_end?: Date;

  @JsonProperty()
  public parent?: number;
}

@Serializable()
export class ProjectRO {
  @JsonProperty()
  title: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  responsibles: number[];

  @JsonProperty()
  participants: number[];

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  date_start: Date;

  @JsonProperty()
  date_end?: Date;

  @JsonProperty()
  public projectTags: ProjectTagRO;

  @JsonProperty()
  public projectTasks: ProjectTaskRO;

  @JsonProperty()
  public organization: number;
}
