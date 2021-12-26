import { Entity, Index, ManyToOne, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Contract } from './Contract';
import { Department } from './Department';
import { DepartureReason } from './DepartureReason';
import { Job } from './Job';
import { WorkLocation } from './WorkLocation';
import { Organisation } from '../../organisations/models/Organisation';
import { ResCountry } from '../../organisations/models/ResCountry';
import { ResPartner } from '../../organisations/models/ResPartner';
import { ResPartnerBank } from '../../organisations/models/ResPartnerBank';
import { User } from '../../users/models/User';
import { ResourceCalendar } from '../../resources/models/ResourceCalendar';
import { ResourceResource } from '../../resources/models/ResourceResource';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Unique({ name: 'hr_employee_user_uniq', properties: ['organisation', 'user'] })
export class Employee extends BaseModel<Employee> {
  constructor() {
    super();
  }

  static getInstance(): Employee {
    return container.get(Employee);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => ResourceResource, index: 'hr_employee_resource_id_index' })
  resource!: ResourceResource;

  @OneToOne({ entity: () => Organisation, onDelete: 'set null', index: 'hr_employee_organisation_id_index' })
  organisation!: Organisation;

  @ManyToOne({
    entity: () => ResourceCalendar,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_employee_resource_calendar_id_index',
  })
  resourceCalendar?: ResourceCalendar;

  @Index({ name: 'hr_employee_message_main_attachment_id_index' })
  @Property({ nullable: true })
  messageMainAttachmentId?: number;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  active?: boolean;

  @Property({ nullable: true })
  color?: number;

  @ManyToOne({ entity: () => Department, onDelete: 'set null', nullable: true })
  department?: Department;

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

  @ManyToOne({ entity: () => Employee, onDelete: 'set null', nullable: true })
  parent?: Employee;

  @ManyToOne({ entity: () => Employee, onDelete: 'set null', nullable: true })
  coach?: Employee;

  @Property()
  employeeType!: string;

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

  @Unique({ name: 'hr_employee_barcode_uniq' })
  @Property({ nullable: true })
  barcode?: string;

  @Property({ nullable: true })
  pin?: string;

  @ManyToOne({ entity: () => DepartureReason, nullable: true })
  departureReason?: DepartureReason;

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
