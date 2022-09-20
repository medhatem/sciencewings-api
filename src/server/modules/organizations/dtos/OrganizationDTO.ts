import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address/dtos/AddressDTO';
import { PhoneInformationDTO } from '@/modules/phones/dtos/PhoneDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';
import { UserDTO } from '@/modules/users/dtos/UserDTO';

@JsonObject()
@unique
export class OrganizationInformationDTO extends BaseBodyDTO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  name?: string;
  @JsonProperty()
  email?: string;
  @JsonProperty()
  description?: string;
  @JsonProperty()
  type?: string;
  @JsonProperty({
    type: AddressDTO,
    beforeDeserialize,
  })
  address?: Array<AddressDTO>;
  @JsonProperty({
    type: PhoneInformationDTO,
    beforeDeserialize,
  })
  phones?: Array<PhoneInformationDTO>;

  @JsonProperty()
  owner?: UserDTO;
}
@JsonObject()
@unique
export class GetOrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: OrganizationInformationDTO;
}

@JsonObject()
@unique
export class OrganizationBaseBodyGetDTO extends BaseBodyDTO {
  @JsonProperty({
    type: OrganizationInformationDTO,
    beforeDeserialize,
  })
  data: Array<OrganizationInformationDTO>;
}

@JsonObject()
@unique
export class OrganizationDTO extends BaseRequestDTO {
  @JsonProperty()
  public body?: OrganizationBaseBodyGetDTO;
}
