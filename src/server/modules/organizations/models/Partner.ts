import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Country } from '@/modules/organizations/models/Country';
import { CountryState } from '@/modules/organizations/models/CountryState';
import { PartnerIndustry } from '@/modules/organizations/models/PartnerIndustry';
import { PartnerTitle } from '@/modules/organizations/models/PartnerTitle';
import { User } from '@/modules/users/models/User';

@provideSingleton()
@Entity()
export class Partner extends BaseModel<Partner> {
  constructor() {
    super();
  }

  static getInstance(): Partner {
    return container.get(Partner);
  }
  @PrimaryKey()
  id!: number;

  @Index({ name: 'partner_name_index' })
  @Property({ nullable: true })
  name?: string;

  @ManyToOne({
    entity: () => Organization,
    onDelete: 'set null',
    nullable: true,
    index: 'partner_organization_id_index',
  })
  organization?: Organization;

  @Index({ name: 'partner_display_name_index' })
  @Property({ nullable: true })
  displayName?: string;

  @Index({ name: 'partner_date_index' })
  @Property({ columnType: 'date', nullable: true })
  date?: Date;

  @ManyToOne({ entity: () => PartnerTitle, fieldName: 'title', onDelete: 'set null', nullable: true })
  title?: PartnerTitle;

  @ManyToOne({ entity: () => Partner, onDelete: 'set null', nullable: true, index: 'partner_parent_id_index' })
  parent?: Partner;

  @Index({ name: 'partner_ref_index' })
  @Property({ nullable: true })
  ref?: string;

  @Property({ nullable: true })
  lang?: string;

  @Property({ nullable: true })
  timezone?: string;

  @ManyToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  user?: User;

  @Index({ name: 'partner_vat_index' })
  @Property({ nullable: true })
  vat?: string;

  @Property({ nullable: true })
  website?: string;

  @Property({ columnType: 'text', nullable: true })
  comment?: string;

  @Property({ columnType: 'float8', nullable: true })
  creditLimit?: number;

  @Property({ nullable: true })
  active?: boolean;

  @Property({ nullable: true })
  member?: boolean;

  @Property({ nullable: true })
  function?: string;

  @Property({ nullable: true })
  type?: string;

  @Property({ nullable: true })
  street?: string;

  @Property({ nullable: true })
  street2?: string;

  @Property({ nullable: true })
  zip?: string;

  @Property({ nullable: true })
  city?: string;

  @ManyToOne({ entity: () => CountryState, nullable: true })
  state?: CountryState;

  @ManyToOne({ entity: () => Country, nullable: true })
  country?: Country;

  @Property({ columnType: 'numeric', nullable: true })
  partnerLatitude?: number;

  @Property({ columnType: 'numeric', nullable: true })
  partnerLongitude?: number;

  @Property({ nullable: true })
  email?: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ nullable: true })
  mobile?: string;

  @Property({ nullable: true })
  isorganization?: boolean;

  @ManyToOne({ entity: () => PartnerIndustry, onDelete: 'set null', nullable: true })
  industry?: PartnerIndustry;

  @Property({ nullable: true })
  partnerShare?: boolean;

  @ManyToOne({
    entity: () => Partner,
    onDelete: 'set null',
    nullable: true,
    index: 'partner_commercial_partner_id_index',
  })
  commercialPartner?: Partner;

  @Property({ nullable: true })
  commercialorganizationName?: string;

  @Property({ nullable: true })
  organizationName?: string;

  @Index({ name: 'partner_message_main_attachment_id_index' })
  @Property({ nullable: true })
  messageMainAttachmentId?: number;

  @Property({ nullable: true })
  emailNormalized?: string;

  @Property({ nullable: true })
  messageBounce?: number;

  @Property({ nullable: true })
  signupToken?: string;

  @Property({ nullable: true })
  signupType?: string;

  @Property({ columnType: 'timestamp', length: 6, nullable: true })
  signupExpiration?: Date;

  @Property({ nullable: true })
  partnerGid?: number;

  @Property({ nullable: true })
  additionalInfo?: string;

  @Property({ nullable: true })
  phoneSanitized?: string;
}
