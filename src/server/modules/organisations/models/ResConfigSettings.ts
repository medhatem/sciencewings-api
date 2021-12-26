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
  organisation!: Organisation;

  @Property({ nullable: true })
  userDefaultRights?: boolean;

  @Property({ nullable: true })
  externalEmailServerDefault?: boolean;

  @Property({ nullable: true })
  moduleGoogleCalendar?: boolean;

  @Property({ nullable: true })
  moduleMicrosoftCalendar?: boolean;

  @Property({ nullable: true })
  moduleAccountInterorganisationRules?: boolean;

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
