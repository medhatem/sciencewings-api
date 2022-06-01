import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { Organization } from '@/modules//organizations/models/Organization';
import { BaseModel } from '@/modules/base/models/BaseModel';

@provide()
@Entity()
export class Job extends BaseModel<Job> {
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
