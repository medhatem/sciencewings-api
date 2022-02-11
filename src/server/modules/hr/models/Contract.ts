import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { container, provideSingleton } from '@di/index';

import { BaseModel } from '@modules/base/models/BaseModel';
import { ContractType } from './ContractType';
import { Group } from './Group';
import { Membre } from './Membre';
import { Job } from './Job';
import { Organization } from '@modules/organizations/models/Organization';
import { PayrollStructureType } from './PayrollStructureType';
import { ResourceCalendar } from '@modules/resources/models/ResourceCalendar';
import { User } from '@modules/users/models/User';

@provideSingleton()
@Entity()
export class Contract extends BaseModel<Contract> {
  constructor() {
    super();
  }

  static getInstance(): Contract {
    return container.get(Contract);
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => PayrollStructureType, onDelete: 'set null', nullable: true })
  structureType?: PayrollStructureType;

  @ManyToOne({ entity: () => Membre, onDelete: 'set null', nullable: true })
  membre?: Membre;

  @ManyToOne({ entity: () => Group, onDelete: 'set null', nullable: true })
  group?: Group;

  @ManyToOne({ entity: () => Job, onDelete: 'set null', nullable: true })
  job?: Job;

  @Index({ name: 'hr_contract_date_start_index' })
  @Property({ columnType: 'date' })
  dateStart!: Date;

  @Property({ columnType: 'date', nullable: true })
  dateEnd?: Date;

  @Property({ columnType: 'date', nullable: true })
  trialDateEnd?: Date;

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

  @ManyToOne({ entity: () => Organization })
  organization!: Organization;

  @ManyToOne({ entity: () => ContractType, onDelete: 'set null', nullable: true })
  contractType?: ContractType;

  @Property({ nullable: true })
  kanbanState?: string;

  @ManyToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  hrResponsible?: User;
}
