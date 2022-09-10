import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';

@provide()
@Entity()
export class Job extends BaseModel<Job> {
  constructor() {
    super();
  }

  static getInstance(): Job {
    return container.get(Job);
  }

  @Index({ name: 'hr_job_name_index' })
  @PrimaryKey()
  name!: string;

  @ManyToOne({ entity: () => Organization, primary: true, unique: false })
  organization!: Organization;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @Property()
  state!: string;
}
