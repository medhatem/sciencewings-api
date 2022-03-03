import { JsonProperty, Serializable } from 'typescript-json-serializer';

import { AddressRO } from '@/modules/address/routes/AddressRO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { unique } from '@/decorators/unique';

@Serializable()
@unique
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
  status?: string;
}
