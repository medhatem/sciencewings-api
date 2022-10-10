import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address/dtos/AddressDTO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';

@unique
@JsonObject()
export class UserDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  firstname: string;

  @JsonProperty()
  lastname: string;

  @JsonProperty()
  email: string;

  @JsonProperty({
    type: PhoneRO,
    name: 'phone',
    beforeDeserialize,
  })
  phones: Array<PhoneRO>;

  @JsonProperty({
    type: AddressDTO,
    name: 'address',
    beforeDeserialize,
  })
  addresses: Array<AddressDTO>;

  @JsonProperty()
  keycloakId: string;
}

@unique
@JsonObject()
export class UserBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty({
    type: UserDTO,
    beforeDeserialize,
  })
  public data: Array<UserDTO>;
}

@unique
@JsonObject()
export class UserGetDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: UserBaseBodyGetDTO;
}

@JsonObject()
@unique
export class membershipBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  name: string;
  @JsonProperty()
  groupId: string;
  @JsonProperty()
  orgId: string;

  @JsonProperty()
  membershipStatus: string;
}

@JsonObject()
@unique
export class GetMembershipBodyDTO extends BaseBodyDTO {
  @JsonProperty({
    type: membershipBodyDTO,
    beforeDeserialize,
  })
  data: Array<membershipBodyDTO>;
}

@JsonObject()
@unique
export class MembershipDto extends BaseRequestDTO {
  @JsonProperty()
  body: GetMembershipBodyDTO;
}

@JsonObject()
@unique
export class changeUserLanguageBodyDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
}

@JsonObject()
@unique
export class changeUserLanguageDTO extends BaseRequestDTO {
  @JsonProperty()
  body: changeUserLanguageBodyDTO;
}
