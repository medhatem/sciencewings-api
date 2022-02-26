import { AddressDTO, PhoneDTO } from '@/modules/..';
import { JsonProperty, Serializable } from 'typescript-json-serializer';

@Serializable()
export class CreateMemberRO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  resource!: number;
  @JsonProperty()
  organization!: number;
  @JsonProperty()
  name?: string;
  @JsonProperty()
  active?: boolean;
  @JsonProperty()
  jobTitle?: string;
  @JsonProperty()
  address?: AddressDTO;
  @JsonProperty()
  workPhone?: PhoneDTO;
  @JsonProperty()
  mobilePhone?: PhoneDTO;
  @JsonProperty()
  workEmail?: string;
  @JsonProperty()
  workLocation?: AddressDTO;
  @JsonProperty()
  memberType!: string;
  @JsonProperty()
  addressHome?: AddressDTO;
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
  @JsonProperty()
  birthday?: Date;
  @JsonProperty()
  identificationId?: string;
  @JsonProperty()
  passportId?: string;
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
  emergencyPhone?: PhoneDTO;
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
  @JsonProperty()
  name?: string;
  @JsonProperty()
  active?: boolean;
  @JsonProperty()
  jobTitle?: string;
  @JsonProperty()
  address?: AddressDTO;
  @JsonProperty()
  workPhone?: PhoneDTO;
  @JsonProperty()
  mobilePhone?: PhoneDTO;
  @JsonProperty()
  workEmail?: string;
  @JsonProperty()
  workLocation?: AddressDTO;
  @JsonProperty()
  memberType!: string;
  @JsonProperty()
  addressHome?: AddressDTO;

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
  @JsonProperty()
  birthday?: Date;
  @JsonProperty()
  identificationId?: string;
  @JsonProperty()
  passportId?: string;
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
  emergencyPhone?: PhoneDTO;
  @JsonProperty()
  notes?: string;
  @JsonProperty()
  departureDescription?: string;
  @JsonProperty()
  departureDate?: Date;
}
