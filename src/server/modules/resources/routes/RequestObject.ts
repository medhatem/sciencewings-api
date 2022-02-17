import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class CreateResourceCalendarRO {
  @JsonProperty()
  name!: string;

  @JsonProperty()
  active?: boolean;

  @JsonProperty()
  organization?: number;

  @JsonProperty()
  hoursPerDay?: number;

  @JsonProperty()
  timezone!: string;

  @JsonProperty()
  twoWeeksCalendar?: boolean;
}

@Serializable()
export class CreateResourceRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  active?: boolean;

  @JsonProperty()
  organization?: number;

  @JsonProperty()
  resourceType!: string;

  @JsonProperty()
  user?: number;

  @JsonProperty()
  timeEfficiency!: number;

  @JsonProperty()
  timezone!: string;

  @JsonProperty()
  calendar!: CreateResourceCalendarRO;
}
