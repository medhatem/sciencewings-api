import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { HrEmployee } from './HrEmployee';
import { Organisation } from '../../organisations/models/Organisation';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class HrDepartment extends BaseModel<HrDepartment> {
  constructor() {
    super();
  }

  static getInstance(): HrDepartment {
    return container.get(HrDepartment);
  }

  @PrimaryKey()
  id!: number;

  @Index({ name: 'hr_department_message_main_attachment_id_index' })
  @Property({ nullable: true })
  messageMainAttachmentId?: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  completeName?: string;

  @Property({ nullable: true })
  active?: boolean;

  @ManyToOne({
    entity: () => Organisation,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_department_company_id_index',
  })
  company?: Organisation;

  @ManyToOne({
    entity: () => HrDepartment,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_department_parent_id_index',
  })
  parent?: HrDepartment;

  @ManyToOne({ entity: () => HrEmployee, onDelete: 'set null', nullable: true })
  manager?: HrEmployee;

  @Property({ columnType: 'text', nullable: true })
  note?: string;

  @Property({ nullable: true })
  color?: number;
}
