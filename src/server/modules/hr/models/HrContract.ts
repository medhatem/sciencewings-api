import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { HrContractType } from './HrContractType';
import { HrDepartment } from './HrDepartment';
import { HrEmployee } from './HrEmployee';
import { HrJob } from './HrJob';
import { HrPayrollStructureType } from './HrPayrollStructureType';
import { Organisation } from '../../organisations/models/Organisation';
import { User } from '../../users/models/User';
import { ResourceCalendar } from '../../ressources/models/ResourceCalendar';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrContract extends BaseModel<HrContract> {
  constructor() {
    super();
  }

  static getInstance(): HrContract {
    return container.get(HrContract);
  }

  @PrimaryKey()
  id!: number;

  @Index({ name: 'hr_contract_message_main_attachment_id_index' })
  @Property({ nullable: true })
  messageMainAttachmentId?: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({ entity: () => HrPayrollStructureType, onDelete: 'set null', nullable: true })
  structureType?: HrPayrollStructureType;

  @ManyToOne({ entity: () => HrEmployee, onDelete: 'set null', nullable: true })
  employee?: HrEmployee;

  @ManyToOne({ entity: () => HrDepartment, onDelete: 'set null', nullable: true })
  department?: HrDepartment;

  @ManyToOne({ entity: () => HrJob, onDelete: 'set null', nullable: true })
  job?: HrJob;

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

  @ManyToOne({ entity: () => Organisation })
  company!: Organisation;

  @ManyToOne({ entity: () => HrContractType, onDelete: 'set null', nullable: true })
  contractType?: HrContractType;

  @Property({ nullable: true })
  kanbanState?: string;

  @ManyToOne({ entity: () => User, onDelete: 'set null', nullable: true })
  hrResponsible?: User;
}
