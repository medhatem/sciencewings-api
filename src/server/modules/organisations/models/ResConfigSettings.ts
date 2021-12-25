import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { Organisation } from './Organisation';
import { User } from '../../users/models/User';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class ResConfigSettings extends BaseModel<ResConfigSettings> {
  constructor() {
    super();
  }

  static getInstance(): ResConfigSettings {
    return container.get(ResConfigSettings);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Organisation, onDelete: 'cascade' })
  company!: Organisation;

  @Property({ nullable: true })
  userDefaultRights?: boolean;

  @Property({ nullable: true })
  externalEmailServerDefault?: boolean;

  @Property({ nullable: true })
  moduleBaseImport?: boolean;

  @Property({ nullable: true })
  moduleGoogleCalendar?: boolean;

  @Property({ nullable: true })
  moduleMicrosoftCalendar?: boolean;

  @Property({ nullable: true })
  moduleMailPlugin?: boolean;

  @Property({ nullable: true })
  moduleGoogleDrive?: boolean;

  @Property({ nullable: true })
  moduleGoogleSpreadsheet?: boolean;

  @Property({ nullable: true })
  moduleAuthOauth?: boolean;

  @Property({ nullable: true })
  moduleAuthLdap?: boolean;

  @Property({ nullable: true })
  moduleBaseGengo?: boolean;

  @Property({ nullable: true })
  moduleAccountInterCompanyRules?: boolean;

  @Property({ nullable: true })
  modulePad?: boolean;

  @Property({ nullable: true })
  moduleVoip?: boolean;

  @Property({ nullable: true })
  moduleWebUnsplash?: boolean;

  @Property({ nullable: true })
  modulePartnerAutocomplete?: boolean;

  @Property({ nullable: true })
  moduleBaseGeolocalize?: boolean;

  @Property({ nullable: true })
  moduleGoogleRecaptcha?: boolean;

  @Property({ nullable: true })
  groupMultiCurrency?: boolean;

  @Property({ nullable: true })
  showEffect?: boolean;

  @Property({ columnType: 'timestamp', length: 6, nullable: true })
  profilingEnabledUntil?: Date;

  @Property({ nullable: true })
  moduleProductImages?: boolean;

  @Property({ nullable: true })
  failCounter?: number;

  @Property({ nullable: true })
  aliasDomain?: string;

  @Property({ nullable: true })
  restrictTemplateRendering?: boolean;

  @Property({ nullable: true })
  useTwilioRtcServers?: boolean;

  @Property({ nullable: true })
  twilioAccountSid?: string;

  @Property({ nullable: true })
  twilioAccountToken?: string;

  @Property({ nullable: true })
  unsplashAccessKey?: string;

  @Property({ nullable: true })
  authSignupResetPassword?: boolean;

  @Property({ nullable: true })
  authSignupUninvited?: string;

  @ManyToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  authSignupTemplateUser?: User;

  @Property({ nullable: true })
  moduleHrPresence?: boolean;

  @Property({ nullable: true })
  moduleHrSkills?: boolean;

  @Property({ nullable: true })
  hrPresenceControlLogin?: boolean;

  @Property({ nullable: true })
  hrPresenceControlEmail?: boolean;

  @Property({ nullable: true })
  hrPresenceControlIp?: boolean;

  @Property({ nullable: true })
  moduleHrAttendance?: boolean;

  @Property({ nullable: true })
  hrEmployeeSelfEdit?: boolean;
}
