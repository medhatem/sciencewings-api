import { Entity, Index, ManyToOne, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '@modules/base/models/BaseModel';
import { Contract } from './Contract';
import { Group } from './Group';
import { Job } from './Job';
import { Organization } from '@modules/organizations/models/Organization';
import { ResCountry } from '@modules/organizations/models/ResCountry';
import { ResPartner } from '@modules/organizations/models/ResPartner';
import { ResPartnerBank } from '@modules/organizations/models/ResPartnerBank';
import { ResourceCalendar } from '@modules/resources/models/ResourceCalendar';
import { Resource } from '@modules/resources/models/Resource';
import { User } from '@modules/users/models/User';
import { WorkLocation } from './WorkLocation';

@provideSingleton()
@Entity()
@Unique({ name: 'hr_membre_user_uniq', properties: ['organization', 'user'] })
export class Membre extends BaseModel<Membre> {
  constructor() {
    super();
  }

  static getInstance(): Membre {
    return container.get(Membre);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Resource, index: 'hr_membre_resource_id_index' })
  resource!: Resource;

  @OneToOne({ entity: () => Organization, onDelete: 'set null', index: 'hr_membre_organization_id_index' })
  organization!: Organization;

  @ManyToOne({
    entity: () => ResourceCalendar,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_membre_resource_calendar_id_index',
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

  @ManyToOne({ entity: () => ResPartner, onDelete: 'set null', nullable: true })
  address?: ResPartner;

  @Property({ nullable: true })
  workPhone?: string;

  @Property({ nullable: true })
  mobilePhone?: string;

  @Property({ nullable: true })
  workEmail?: string;

  @ManyToOne({ entity: () => WorkLocation, onDelete: 'set null', nullable: true })
  workLocation?: WorkLocation;

  @OneToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  user?: User;

  @ManyToOne({ entity: () => Membre, onDelete: 'set null', nullable: true })
  parent?: Membre;

  @ManyToOne({ entity: () => Membre, onDelete: 'set null', nullable: true })
  coach?: Membre;

  @Property()
  membreType!: string;

  @ManyToOne({ entity: () => ResPartner, onDelete: 'set null', nullable: true })
  addressHome?: ResPartner;

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
  ssnid?: string;

  @Property({ nullable: true })
  sinid?: string;

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

  @Property({ nullable: true })
  emergencyPhone?: string;

  @Property({ nullable: true })
  kmHomeWork?: number;

  @Property({ columnType: 'text', nullable: true })
  notes?: string;

  @Unique({ name: 'hr_membre_barcode_uniq' })
  @Property({ nullable: true })
  barcode?: string;

  @Property({ nullable: true })
  pin?: string;

  @Property({ columnType: 'text', nullable: true })
  departureDescription?: string;

  @Property({ columnType: 'date', nullable: true })
  departureDate?: Date;

  @Property({ nullable: true })
  vehicle?: string;

  @ManyToOne({ entity: () => Contract, onDelete: 'set null', nullable: true })
  contract?: Contract;

  @Property({ nullable: true })
  contractWarning?: boolean;

  @Property({ columnType: 'date', nullable: true })
  firstContractDate?: Date;
}
