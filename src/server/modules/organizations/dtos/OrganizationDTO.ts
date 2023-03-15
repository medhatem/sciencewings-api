import { BaseBodyDTO, BaseRequestDTO } from '@/modules/base/dtos/BaseDTO';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { AddressDTO } from '@/modules/address/dtos/AddressDTO';
import { PhoneInformationDTO } from '@/modules/phones/dtos/PhoneDTO';
import { beforeDeserialize } from '@/utils/utilities';
import { unique } from '@/decorators/unique';
import { UserDTO } from '@/modules/users/dtos/UserDTO';
import { OrganizationSettingsBodyDTO } from '@/modules/organizations/dtos/OrganizationSettingsDTO';

@JsonObject()
@unique
export class OrganizationLabelsDTO {
  @JsonProperty()
  name: string;
}
@JsonObject()
@unique
export class OrganizationId {
  @JsonProperty()
  id: number;
}

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

  @JsonProperty()
  address?: AddressDTO;

  @JsonProperty()
  phone?: PhoneInformationDTO;

  @JsonProperty()
  owner?: UserDTO;

  @JsonProperty()
  settings?: OrganizationSettingsBodyDTO;

  @JsonProperty()
  parent?: OrganizationInformationDTO;

  @JsonProperty({
    type: OrganizationInformationDTO,
    beforeDeserialize,
  })
  labels?: Array<OrganizationInformationDTO>;
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
