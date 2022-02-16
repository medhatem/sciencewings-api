import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressType } from '@/modules/address/models/AdressModel';

@Serializable()
export class AddressOrganizationDTO {
  @JsonProperty()
  country: string;

  @JsonProperty()
  province: string;

  @JsonProperty()
  code: string;

  @JsonProperty()
  type: AddressType;

  @JsonProperty()
  city: string;

  @JsonProperty()
  street: string;

  @JsonProperty()
  appartement: number;
}
