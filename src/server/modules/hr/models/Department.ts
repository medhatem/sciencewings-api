import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Employee } from './Employee';
import { Organisation } from '../../organisations/models/Organisation';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class Department extends BaseModel<Department> {
  constructor() {
    super();
  }

  static getInstance(): Department {
    return container.get(Department);
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
    index: 'hr_department_organisation_id_index',
  })
  organisation?: Organisation;

  @ManyToOne({
    entity: () => Department,
    onDelete: 'set null',
    nullable: true,
    index: 'hr_department_parent_id_index',
  })
  parent?: Department;

  @ManyToOne({ entity: () => Employee, onDelete: 'set null', nullable: true })
  manager?: Employee;

  @Property({ columnType: 'text', nullable: true })
  note?: string;

  @Property({ nullable: true })
  color?: number;
}
