import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
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
@unique
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
