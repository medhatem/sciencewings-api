import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { MemberDTO } from '@/modules/hr/dtos/MemberDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class PaginationBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  length: number;
  @JsonProperty()
  size: number;
  @JsonProperty()
  page: number;
  @JsonProperty()
  lastPage: number;
  @JsonProperty()
  startIndex: number;
  @JsonProperty()
  endIndex: number;
}

@JsonObject()
@unique
class OrganizationMembersBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: MemberDTO,
    beforeDeserialize,
  })
  data: Array<MemberDTO>;

  @JsonProperty()
  pagination?: PaginationBodyDTO;
}

@JsonObject()
@unique
export class OrganizationMembersDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: OrganizationMembersBodyDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
