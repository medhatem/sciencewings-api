import { AddressRO } from './../../address/routes/AddressRO';
import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { PhoneRO } from '../../..';

@Serializable()
export class ContractRO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name!: string;

  @JsonProperty()
  dateStart!: Date;

  @JsonProperty()
  wage!: number;

  @JsonProperty()
  organization!: number;

  @JsonProperty()
  active?: boolean;

  // @JsonProperty()
  // structureType?: PayrollStructureType;

  @JsonProperty()
  member?: number;

  @JsonProperty()
  group?: number;

  @JsonProperty()
  job?: number;

  @JsonProperty()
  dateEnd?: Date;

  @JsonProperty()
  trialDateEnd?: Date;

  @JsonProperty()
  resourceCalendar?: number;

  @JsonProperty()
  notes?: string;

  @JsonProperty()
  state?: string;

  // @JsonProperty()
  // contractType?: ContractType;

  @JsonProperty()
  kanbanState?: string;

  @JsonProperty()
  hrResponsible?: number;
}

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
  address?: AddressRO;
  @JsonProperty()
  workPhone?: PhoneRO;
  @JsonProperty()
  mobilePhone?: PhoneRO;
  @JsonProperty()
  workEmail?: string;
  @JsonProperty()
  workLocation?: AddressRO;
  // @JsonProperty()
  // user?: number;
  // @JsonProperty()
  // parent?: number;
  // @JsonProperty()
  // coach?: number;
  @JsonProperty()
  memberType!: string;
  @JsonProperty()
  addressHome?: AddressRO;
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
  emergencyPhone?: PhoneRO;
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
  address?: AddressRO;
  @JsonProperty()
  workPhone?: PhoneRO;
  @JsonProperty()
  mobilePhone?: PhoneRO;
  @JsonProperty()
  workEmail?: string;
  @JsonProperty()
  workLocation?: AddressRO;
  // @JsonProperty()
  // user?: number;
  // @JsonProperty()
  // parent?: number;
  // @JsonProperty()
  // coach?: number;
  @JsonProperty()
  memberType!: string;
  @JsonProperty()
  addressHome?: AddressRO;
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
  emergencyPhone?: PhoneRO;
  @JsonProperty()
  notes?: string;
  @JsonProperty()
  departureDescription?: string;
  @JsonProperty()
  departureDate?: Date;
}
