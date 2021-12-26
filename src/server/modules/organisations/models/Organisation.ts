import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { ResCurrency } from './ResCurrency';
import { ResPartner } from './ResPartner';
import { ResourceCalendar } from '../../ressources/models/ResourceCalendar';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class Organisation extends BaseModel<Organisation> {
  constructor() {
    super();
  }

  static getInstance(): Organisation {
    return container.get(Organisation);
  }
  @PrimaryKey()
  id!: number;

  @Unique({ name: 'res_organisation_name_uniq' })
  @Property()
  name!: string;

  @ManyToOne({ entity: () => ResPartner })
  partner!: ResPartner;

  @ManyToOne({ entity: () => ResCurrency })
  currency!: ResCurrency;

  @Property({ nullable: true })
  sequence?: number;

  @ManyToOne({
    entity: () => Organisation,
    onDelete: 'set null',
    nullable: true,
    index: 'res_organisation_parent_id_index',
  })
  parent?: Organisation;

  @Property({ columnType: 'text', nullable: true })
  reportHeader?: string;

  @Property({ columnType: 'text', nullable: true })
  reportFooter?: string;

  @Property({ columnType: 'text', nullable: true })
  organisationDetails?: string;

  @Property({ nullable: true })
  logoWeb?: Buffer;

  @Property({ nullable: true })
  email?: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ nullable: true })
  mobile?: string;

  @Property({ nullable: true })
  organisationRegistry?: string;

  @Property({ nullable: true })
  paperformatId?: number;

  @Property({ nullable: true })
  externalReportLayoutId?: number;

  @Property({ nullable: true })
  baseOnboardingorganisationState?: string;

  @Property({ nullable: true })
  font?: string;

  @Property({ nullable: true })
  primaryColor?: string;

  @Property({ nullable: true })
  secondaryColor?: string;

  @Property()
  layoutBackground!: string;

  @ManyToOne({ entity: () => ResourceCalendar, nullable: true })
  resourceCalendar?: ResourceCalendar;

  @Property({ nullable: true })
  hrPresenceControlEmailAmount?: number;

  @Property({ nullable: true })
  hrPresenceControlIpList?: string;

  @Property({ nullable: true })
  partnerGid?: number;

  @Property({ nullable: true })
  iapEnrichAutoDone?: boolean;

  @Property({ nullable: true })
  snailmailColor?: boolean;

  @Property({ nullable: true })
  snailmailCover?: boolean;

  @Property({ nullable: true })
  snailmailDuplex?: boolean;
}
