import { BaseBodyDTO, BaseErrorDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address';
import { PhoneInformationDTO } from '@/modules/phones';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@JsonObject()
@unique
export class MemberDTO extends BaseBodyDTO {
  @JsonProperty()
  name: string;

  @JsonProperty({
    beforeDeserialize: (prop: any) => {
      if (typeof prop === 'object') {
        return prop.id;
      }
      return prop;
    },
  })
  user: number;

  @JsonProperty({
    beforeDeserialize: (prop: any) => {
      if (typeof prop === 'object') {
        return prop.id;
      }
      return prop;
    },
  })
  organization: number;

  @JsonProperty()
  status: string;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  joinDate: Date;

  @JsonProperty()
  workEmail: string;
}

@JsonObject()
@unique
export class MemberBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: MemberDTO,
    beforeDeserialize,
  })
  data: Array<MemberDTO>;
}

@JsonObject()
@unique
export class MemberRequestDTO extends BaseRequestDTO {
  @JsonProperty()
  body: MemberBodyDTO;
}

@JsonObject()
@unique
export class SwitchedMemberBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class SwitchedMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  body: SwitchedMemberBodyDTO;
}

@JsonObject()
@unique
class CreateMemberBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class CreateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: CreateMemberBaseBodyGetDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}
@JsonObject()
@unique
export class UpdateMemberBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  userId: number;
  @JsonProperty()
  orgId: number;
}

@JsonObject()
@unique
export class UpdateMemberDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: UpdateMemberBodyDTO;
  @JsonProperty()
  public error?: BaseErrorDTO;
}
@JsonObject()
export class getMembershipBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name: string;
}
@JsonObject()
@unique
export class getAllMembershipsBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: getMembershipBodyDTO,
    beforeDeserialize,
  })
  data: Array<getMembershipBodyDTO>;
}
@JsonObject()
@unique
export class getMembershipDTO extends BaseRequestDTO {
  @JsonProperty()
  body: getAllMembershipsBodyDTO;
}

@JsonObject()
@unique
export class MemberProfile extends BaseBodyDTO {
  @JsonProperty()
  address: AddressDTO;

  @JsonProperty()
  jobTitle: string;

  @JsonProperty()
  workPhone: PhoneInformationDTO;

  @JsonProperty()
  workEmail: string;

  @JsonProperty()
  name: string;

  @JsonProperty()
  status: string;
}

@JsonObject()
@unique
export class MemberProfileBodyDTO extends BaseRequestDTO {
  @JsonProperty()
  body: MemberProfile;
}
