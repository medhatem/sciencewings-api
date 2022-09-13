import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from '@/modules/organizations/models/Organization';
import { Contract } from '@/modules/hr/models/Contract';

export enum JobState {
  WORKING = 'Working',
  BANNED = 'Banned',
}

@provide()
@Entity()
export class Job extends BaseModel<Job> {
  constructor() {
    super();
  }

  static getInstance(): Job {
    return container.get(Job);
  }

  @PrimaryKey()
  id?: number;

  @Property({ columnType: 'text', nullable: false })
  name!: string;

  @ManyToOne({ entity: () => Organization, unique: false })
  organization!: Organization;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @OneToMany({
    entity: () => Contract,
    mappedBy: (con) => con.job,
    nullable: true,
    eager: false,
    lazy: true,
  })
  public contracts? = new Collection<Contract>(this);

  @Property()
  state!: JobState;
}
