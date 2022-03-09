import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from './Organization';

@provideSingleton()
@Entity()
export class ConfigSettings extends BaseModel<ConfigSettings> {
  constructor() {
    super();
  }

  static getInstance(): ConfigSettings {
    return container.get(ConfigSettings);
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Organization, onDelete: 'cascade' })
  organization!: Organization;

  @Property({ nullable: true })
  userDefaultRights?: boolean;

  @Property({ nullable: true })
  externalEmailServerDefault?: boolean;

  @Property({ nullable: true })
  moduleGoogleCalendar?: boolean;

  @Property({ nullable: true })
  moduleMicrosoftCalendar?: boolean;

  @Property({ nullable: true })
  moduleAccountInterorganizationRules?: boolean;

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
  hrMemberSelfEdit?: boolean;
}
