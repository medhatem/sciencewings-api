import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';

import { BaseModel } from '@/modules/base/models/BaseModel';
import { Calendar } from '@/modules/reservation/models/Calendar';
import { Group } from '@/modules/hr/models/Group';
import { Job } from '@/modules/hr/models/Job';
import { Member } from '@/modules/hr/models/Member';

export enum JobLevel {
  INTERNSHIP = 'Internship',
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

  @Property({ nullable: true })
  jobLevel?: JobLevel;

  @Property({ nullable: true })
  wage?: number;

  @Property({ nullable: true })
  contractType?: ContractTypes;

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
    entity: () => Calendar,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_contract_resource_calendar_id_index',
  })
  resourceCalendar?: Calendar;

  @Property({ columnType: 'text', nullable: true })
  notes?: string;

  @Property({ nullable: true })
  state?: string;

  @Property({ nullable: true })
  kanbanState?: string;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  supervisor?: Member;
}
