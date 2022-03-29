import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provide } from '@/di/index';
import { ContractType } from '@/modules/hr/models/ContractType';
import { Group } from '@/modules/hr/models/Group';
import { Job } from '@/modules/hr/models/Job';
import { Member } from '@/modules/hr/models/Member';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { BaseModel } from '@/modules/base';

@provide()
@Entity()
export class Contract extends BaseModel<Contract> {
  static getInstance(): Contract {
    return container.get(Contract);
  }

  @PrimaryKey()
  id?: number;

  @ManyToOne({ entity: () => Member, primary: true, unique: false })
  member!: Member;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => Group, onDelete: 'set null', nullable: true })
  group?: Group;

  @ManyToOne({ entity: () => Job, onDelete: 'set null', nullable: true })
  job?: Job;

  @Index({ name: 'hr_contract_date_start_index' })
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

  @Property({ columnType: 'numeric' })
  wage!: number;

  @Property({ columnType: 'text', nullable: true })
  notes?: string;

  @Property({ nullable: true })
  state?: string;

  @ManyToOne({ entity: () => ContractType, onDelete: 'set null', nullable: true })
  contractType?: ContractType;

  @Property({ nullable: true })
  kanbanState?: string;

  @ManyToOne({ entity: () => Member, onDelete: 'set null', nullable: true })
  supervisor?: Member;
}
