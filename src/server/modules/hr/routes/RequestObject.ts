import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { MemberTypeEnum, MembershipStatus } from '@/modules/hr/models/Member';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';
import { userStatus } from '@/modules/users/models/User';
import { JobLevel, ContractTypes } from '@/modules/hr/models/Contract';

@JsonObject()
@unique
export class MemberKeyRO {
  @JsonProperty()
  userId: number;
  @JsonProperty()
  orgId: number;
}

@JsonObject()
@unique
export class CreateContractRO {
  @JsonProperty()
  name!: string;

  @JsonProperty()
  organization!: number;

  @JsonProperty()
  user!: number;

  @JsonProperty()
  jobLevel?: JobLevel;

  @JsonProperty()
  wage?: number;

  @JsonProperty()
  contractType?: ContractTypes;

  @JsonProperty()
  dateStart!: Date;

  @JsonProperty()
  dateEnd?: Date;

  @JsonProperty()
  supervisor?: number;

  @JsonProperty()
  description?: string;
}

@JsonObject()
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

@JsonObject()
@unique
export class MemberRO {
  @JsonProperty()
  id?: number;
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
  memberType?: MemberTypeEnum;
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
  status?: userStatus;
  @JsonProperty()
  membership?: MembershipStatus;
}

@JsonObject()
@unique
export class UpdateMemberRO {
  @JsonProperty()
  id?: number;
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
  memberType?: string;
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
  status?: userStatus;
}

@JsonObject()
@unique
export class GroupRO {
  @JsonProperty()
  name: string;

  @JsonProperty()
  active: boolean;

  @JsonProperty()
  organization: number;

  @JsonProperty()
  parent: number;

  @JsonProperty()
  members?: number[];

  @JsonProperty()
  description: string;
}
