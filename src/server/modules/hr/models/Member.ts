import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '../../base/models/BaseModel';
import { Contract } from './Contract';
import { Group } from './Group';
import { Job } from './Job';
import { Organization } from '../../organizations/models/Organization';
import { ResCountry } from '../../organizations/models/ResCountry';
import { ResPartnerBank } from '../../organizations/models/ResPartnerBank';
import { ResourceCalendar } from '../../resources/models/ResourceCalendar';
import { Resource } from '../../resources/models/Resource';
import { User } from '../../users/models/User';
import { WorkLocation } from './WorkLocation';
import { Phone } from '../../phones/models/Phone';
import { Address } from '../../..';

@provideSingleton()
@Entity()
@Unique({ name: 'hr_member_user_uniq', properties: ['organization', 'user'] })
export class Member extends BaseModel<Member> {
  constructor() {
    super();
  }

  static getInstance(): Member {
    return container.get(Member);
  }

  generateNewInstance?(): Member {
    return Member.getInstance();
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Resource, index: 'hr_member_resource_id_index' })
  resource!: Resource;

  @OneToOne({ entity: () => Organization, onDelete: 'set null', index: 'hr_member_organization_id_index' })
  organization!: Organization;

  @ManyToOne({
    entity: () => ResourceCalendar,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_member_resource_calendar_id_index',
  })
  resourceCalendar?: ResourceCalendar;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Group, onDelete: 'set null', nullable: true })
  group?: Group;

  @ManyToOne({ entity: () => Job, onDelete: 'set null', nullable: true })
  job?: Job;

  @Property({ nullable: true })
  jobTitle?: string;

  @ManyToOne({ entity: () => Address, onDelete: 'set null', nullable: true })
  address?: Address;

  @OneToOne({ entity: () => Phone, nullable: true })
  workPhone?: Phone;

  @OneToOne({ entity: () => Phone, nullable: true })
  mobilePhone?: Phone;

  @Property({ nullable: true })
  workEmail?: string;

  @ManyToOne({ entity: () => WorkLocation, onDelete: 'set null', nullable: true })
  workLocation?: WorkLocation;

  @OneToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  user?: User;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  parent?: Member;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  coach?: Member;

  @Property()
  memberType!: string;

  @ManyToOne({ entity: () => Address, onDelete: 'set null', nullable: true })
  addressHome?: Address;

  @ManyToOne({ entity: () => ResCountry, onDelete: 'set null', nullable: true })
  country?: ResCountry;

  @Property({ nullable: true })
  gender?: string;

  @Property({ nullable: true })
  marital?: string;

  @Property({ nullable: true })
  spouseCompleteName?: string;

  @Property({ columnType: 'date', nullable: true })
  spouseBirthdate?: Date;

  @Property({ nullable: true })
  children?: number;

  @Property({ nullable: true })
  placeOfBirth?: string;

  @ManyToOne({ entity: () => ResCountry, fieldName: 'country_of_birth', onDelete: 'set null', nullable: true })
  countryOfBirth?: ResCountry;

  @Property({ columnType: 'date', nullable: true })
  birthday?: Date;

  @Property({ nullable: true })
  identificationId?: string;

  @Property({ nullable: true })
  passportId?: string;

  @ManyToOne({ entity: () => ResPartnerBank, onDelete: 'set null', nullable: true })
  bankAccount?: ResPartnerBank;

  @Property({ nullable: true })
  permitNo?: string;

  @Property({ nullable: true })
  visaNo?: string;

  @Property({ columnType: 'date', nullable: true })
  visaExpire?: Date;

  @Property({ columnType: 'date', nullable: true })
  workPermitExpirationDate?: Date;

  @Property({ nullable: true })
  workPermitScheduledActivity?: boolean;

  @Property({ columnType: 'text', nullable: true })
  additionalNote?: string;

  @Property({ nullable: true })
  certificate?: string;

  @Property({ nullable: true })
  studyField?: string;

  @Property({ nullable: true })
  studySchool?: string;

  @Property({ nullable: true })
  emergencyContact?: string;

  @OneToOne({ entity: () => Phone, nullable: true })
  emergencyPhone?: Phone;

  @Property({ columnType: 'text', nullable: true })
  notes?: string;

  @Property({ columnType: 'text', nullable: true })
  departureDescription?: string;

  @Property({ columnType: 'date', nullable: true })
  departureDate?: Date;

  @ManyToOne({ entity: () => Contract, onDelete: 'set null', nullable: true })
  contract?: Contract;
}
