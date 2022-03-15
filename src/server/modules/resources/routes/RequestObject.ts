import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@Serializable()
@unique
export class ResourceTagRO {
  @JsonProperty()
  title!: string;
}

@Serializable()
@unique
export class ResourceCalendarRO {
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
export class ResourceRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  description: string;

  @JsonProperty()
  active?: boolean;

  @JsonProperty()
  organization?: number;

  @JsonProperty()
  resourceType!: string;

  @JsonProperty()
  user?: number;

  @JsonProperty()
  timezone!: string;

  @JsonProperty()
  calendar!: ResourceCalendarRO;

  @JsonProperty()
  tags?: ResourceTagRO[];
}
