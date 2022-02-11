import { dto, include } from 'dto-mapper';
// import { Address, Phone, ResCountry, ResPartnerBank } from '../../..';

@dto()
export class CreateMemberRO {
  @include()
  id: number;
  @include()
  resource!: number;
  @include()
  organization!: number;
  // @include()
  // resourceCalendar?: number;
  @include()
  name?: string;
  @include()
  active?: boolean;
  // @include()
  // group?: number;
  // @include()
  // job?: number;
  @include()
  jobTitle?: string;
  // @include()
  // address?: Address;
  // @include()
  // workPhone?: Phone;
  // @include()
  // mobilePhone?: Phone;
  @include()
  workEmail?: string;
  // @include()
  // workLocation?: Address;
  // @include()
  // user?: number;
  // @include()
  // parent?: number;
  // @include()
  // coach?: number;
  @include()
  memberType!: string;
  // @include()
  // addressHome?: Address;
  // @include()
  // country?: ResCountry;
  @include()
  gender?: string;
  @include()
  marital?: string;
  @include()
  spouseCompleteName?: string;
  @include()
  spouseBirthdate?: Date;
  @include()
  children?: number;
  @include()
  placeOfBirth?: string;
  // @include()
  // countryOfBirth?: ResCountry;
  @include()
  birthday?: Date;
  @include()
  identificationId?: string;
  @include()
  passportId?: string;
  // @include()
  // bankAccount?: ResPartnerBank;
  @include()
  permitNo?: string;
  @include()
  visaNo?: string;
  @include()
  visaExpire?: Date;
  @include()
  workPermitExpirationDate?: Date;
  @include()
  workPermitScheduledActivity?: boolean;
  @include()
  additionalNote?: string;
  @include()
  certificate?: string;
  @include()
  studyField?: string;
  @include()
  studySchool?: string;
  @include()
  emergencyContact?: string;
  // @include()
  // emergencyPhone?: Phone;
  @include()
  notes?: string;
  @include()
  departureDescription?: string;
  @include()
  departureDate?: Date;
}
