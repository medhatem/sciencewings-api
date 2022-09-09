import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class ReservationRO {
  @JsonProperty()
  title: string;

  @JsonProperty()
  start: Date;

  @JsonProperty()
  end: Date;
}
