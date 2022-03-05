import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { MemberStatusType } from '@/modules/hr/models/Member';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

export class ContractRO {
  @JsonProperty()
  id: number;

  @JsonProperty()
  name!: string;

  @JsonProperty()
  completeName?: string;

  @JsonProperty()
  dateStart!: Date;

  @JsonProperty()
  wage!: number;

  @JsonProperty()
  organization!: number;

  @JsonProperty()
  active?: boolean;

  @JsonProperty()
  parent?: number;

  @JsonProperty()
  manager?: number;

  @JsonProperty()
  note?: string;

  @JsonProperty()
  member?: number;

  @JsonProperty()
  group?: number;

  @JsonProperty()
  job?: number;

  @JsonProperty()
  resourceCalendar?: number;

  @JsonProperty()
  hrResponsible?: number;
}

@Serializable()
@unique
export class JobRO {
  @JsonProperty()
  name!: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  group?: number;

  @JsonProperty()
  organization?: number;

  @JsonProperty()
  member?: number;

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

  @JsonProperty()
  kanbanState?: string;

  @JsonProperty()
  hrResponsible?: number;
}
@Serializable()
@unique
export class MemberRO {
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
  address?: AddressRO;
  @JsonProperty()
  workPhone?: PhoneRO;
  @JsonProperty()
  mobilePhone?: PhoneRO;
  @JsonProperty()
  workEmail?: string;
  @JsonProperty()
  workLocation?: AddressRO;
  @JsonProperty()
  memberType!: string;
  @JsonProperty()
  addressHome?: AddressRO;
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
  emergencyPhone?: PhoneRO;
  @JsonProperty()
  notes?: string;
  @JsonProperty()
  departureDescription?: string;
  @JsonProperty()
  departureDate?: Date;
  @JsonProperty()
  status?: MemberStatusType;
}

@Serializable()
@unique
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
  workPhone?: PhoneRO;
  @JsonProperty()
  workEmail?: string;
  @JsonProperty()
  workLocation?: AddressRO;
  @JsonProperty()
  memberType!: string;
  @JsonProperty()
  identificationId?: string;
  @JsonProperty()
  studyField?: string;
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
  @JsonProperty()
  status?: MemberStatusType;
}
