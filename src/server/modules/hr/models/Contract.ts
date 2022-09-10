import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { Group } from '@/modules/hr/models/Group';
import { Job } from '@/modules/hr/models/Job';
import { Member } from '@/modules/hr/models/Member';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { BaseModel } from '@/modules/base/models/BaseModel';

export enum JobLevel {
  INTERN = 'Intern',
  JUNIOR = 'Junior',
  MID = 'Midlle',
  MID_SENIOR = 'Mid-senior',
  SENIOR = 'Senior',
}

export enum ContractTypes {
  PERMANANT = 'Permanant',
  CONTRACT_BASE = 'Contract base',
}

@provide()
@Entity()
export class Contract extends BaseModel<Contract> {
  static getInstance(): Contract {
    return container.get(Contract);
  }

  @PrimaryKey()
  id?: number;

  @ManyToOne({ entity: () => Member, unique: false })
  member!: Member;

  @ManyToOne({ entity: () => Job, nullable: true })
  job?: Job;

  @Property()
  jobLevel!: JobLevel;

  @Property()
  wage!: number;

  @Property()
  contractType!: ContractTypes;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Group, onDelete: 'set null', nullable: true })
  group?: Group;

  @Index({ name: 'hr_contract_dateStart_index' })
  @Property({ columnType: 'date' })
  dateStart!: Date;

  @Property({ columnType: 'date', nullable: true })
  dateEnd?: Date;

  @ManyToOne({
    entity: () => ResourceCalendar,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_contract_resource_calendar_id_index',
  })
  resourceCalendar?: ResourceCalendar;

  @Property({ columnType: 'text', nullable: true })
  notes?: string;

  @Property({ nullable: true })
  state?: string;

  @Property({ nullable: true })
  kanbanState?: string;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  supervisor?: Member;
}
