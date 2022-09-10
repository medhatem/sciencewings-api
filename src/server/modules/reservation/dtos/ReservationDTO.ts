import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class ReservationDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  title: string;

  @JsonProperty({ name: 'dateFrom' })
  start: string;

  @JsonProperty({ name: 'dateTo' })
  end: string;
}
@JsonObject()
@unique
export class GetReservationBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ReservationDTO,
    beforeDeserialize,
  })
  data: Array<ReservationDTO>;
}

@JsonObject()
@unique
export class ReservationGetDTO extends BaseRequestDTO {
  @JsonProperty()
  body: GetReservationBodyDTO;
}

@JsonObject()
@unique
export class ReservationCreateDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ReservationDTO;
}

@JsonObject()
@unique
export class ReservationsDataDTO extends BaseBodyDTO {
  @JsonProperty({
    type: ReservationDTO,
    beforeDeserialize,
  })
  data: Array<ReservationDTO>;
}

@JsonObject()
@unique
export class ReservationsDTO extends BaseRequestDTO {
  @JsonProperty()
  body: ReservationsDataDTO;
}
