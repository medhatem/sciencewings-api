import { Entity, Index, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '@/modules//base/models/BaseModel';
import { Group } from './Group';
import { Organization } from '@/modules//organizations/models/Organization';

@provideSingleton()
@Entity()
@Unique({ name: 'hr_job_name_organization_uniq', properties: ['name', 'group', 'organization'] })
export class Job extends BaseModel<Job> {
  constructor() {
    super();
  }

  static getInstance(): Job {
    return container.get(Job);
  }

  @PrimaryKey()
  id!: number;

  @Index({ name: 'hr_job_name_index' })
  @Property()
  name!: string;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @OneToOne({ entity: () => Group, onDelete: 'set null', nullable: true })
  group?: Group;

  @OneToOne({ entity: () => Organization, onDelete: 'set null', nullable: true })
  organization?: Organization;

  @Property()
  state!: string;
}
