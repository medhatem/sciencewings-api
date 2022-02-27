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
  dateStart: Date;

  @JsonProperty()
  dateEnd?: Date;

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
