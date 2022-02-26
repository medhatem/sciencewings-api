import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { Address } from '@/modules/address/models';
import { Phone } from '@/modules/phones/models';

@Serializable()
export class CreateMemberRO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  resource!: number;
  @JsonProperty()
  organization!: number;
  // @JsonProperty()
  // resourceCalendar?: number;
  @JsonProperty()
  name?: string;
  @JsonProperty()
  active?: boolean;
  // @JsonProperty()
  // group?: number;
  // @JsonProperty()
  // job?: number;
  @JsonProperty()
  jobTitle?: string;
  @JsonProperty()
  address?: Address;
  @JsonProperty()
  workPhone?: Phone;
  @JsonProperty()
  mobilePhone?: Phone;
  @JsonProperty()
  workEmail?: string;
  @JsonProperty()
  workLocation?: Address;
  // @JsonProperty()
  // user?: number;
  // @JsonProperty()
  // parent?: number;
  // @JsonProperty()
  // coach?: number;
  @JsonProperty()
  memberType!: string;
  @JsonProperty()
  addressHome?: Address;
  // @JsonProperty()
  // country?: ResCountry;
  @JsonProperty()
  gender?: string;
  @JsonProperty()
  marital?: string;
  @JsonProperty()
  spouseCompleteName?: string;
  @JsonProperty()
  spouseBirthdate?: Date;
  @JsonProperty()
  children?: number;
  @JsonProperty()
  placeOfBirth?: string;
  // @JsonProperty()
  // countryOfBirth?: ResCountry;
  @JsonProperty()
  birthday?: Date;
  @JsonProperty()
  identificationId?: string;
  @JsonProperty()
  passportId?: string;
  // @JsonProperty()
  // bankAccount?: ResPartnerBank;
  @JsonProperty()
  permitNo?: string;
  @JsonProperty()
  visaNo?: string;
  @JsonProperty()
  visaExpire?: Date;
  @JsonProperty()
  workPermitExpirationDate?: Date;
  @JsonProperty()
  workPermitScheduledActivity?: boolean;
  @JsonProperty()
  additionalNote?: string;
  @JsonProperty()
  certificate?: string;
  @JsonProperty()
  studyField?: string;
  @JsonProperty()
  studySchool?: string;
  @JsonProperty()
  emergencyContact?: string;
  @JsonProperty()
  emergencyPhone?: Phone;
  @JsonProperty()
  notes?: string;
  @JsonProperty()
  departureDescription?: string;
  @JsonProperty()
  departureDate?: Date;
}

@Serializable()
export class UpdateMemberRO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  resource?: number;
  @JsonProperty()
  organization?: number;
  // @JsonProperty()
  // resourceCalendar?: number;
  @JsonProperty()
  name?: string;
  @JsonProperty()
  active?: boolean;
  // @JsonProperty()
  // group?: number;
  // @JsonProperty()
  // job?: number;
  @JsonProperty()
  jobTitle?: string;
  @JsonProperty()
  address?: Address;
  @JsonProperty()
  workPhone?: Phone;
  @JsonProperty()
  mobilePhone?: Phone;
  @JsonProperty()
  workEmail?: string;
  @JsonProperty()
  workLocation?: Address;
  // @JsonProperty()
  // user?: number;
  // @JsonProperty()
  // parent?: number;
  // @JsonProperty()
  // coach?: number;
  @JsonProperty()
  memberType!: string;
  @JsonProperty()
  addressHome?: Address;
  // @JsonProperty()
  // country?: ResCountry;
  @JsonProperty()
  gender?: string;
  @JsonProperty()
  marital?: string;
  @JsonProperty()
  spouseCompleteName?: string;
  @JsonProperty()
  spouseBirthdate?: Date;
  @JsonProperty()
  children?: number;
  @JsonProperty()
  placeOfBirth?: string;
  // @JsonProperty()
  // countryOfBirth?: ResCountry;
  @JsonProperty()
  birthday?: Date;
  @JsonProperty()
  identificationId?: string;
  @JsonProperty()
  passportId?: string;
  // @JsonProperty()
  // bankAccount?: ResPartnerBank;
  @JsonProperty()
  permitNo?: string;
  @JsonProperty()
  visaNo?: string;
  @JsonProperty()
  visaExpire?: Date;
  @JsonProperty()
  workPermitExpirationDate?: Date;
  @JsonProperty()
  workPermitScheduledActivity?: boolean;
  @JsonProperty()
  additionalNote?: string;
  @JsonProperty()
  certificate?: string;
  @JsonProperty()
  studyField?: string;
  @JsonProperty()
  studySchool?: string;
  @JsonProperty()
  emergencyContact?: string;
  @JsonProperty()
  emergencyPhone?: Phone;
  @JsonProperty()
  notes?: string;
  @JsonProperty()
  departureDescription?: string;
  @JsonProperty()
  departureDate?: Date;
}
