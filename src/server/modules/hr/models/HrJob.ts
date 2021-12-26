import { Entity, Index, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { HrDepartment } from './HrDepartment';
import { Organisation } from '../../organisations/models/Organisation';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Unique({ name: 'hr_job_name_organisation_uniq', properties: ['name', 'department', 'organisation'] })
export class HrJob extends BaseModel<HrJob> {
  constructor() {
    super();
  }

  static getInstance(): HrJob {
    return container.get(HrJob);
  }

  @PrimaryKey()
  id!: number;

  @Index({ name: 'hr_job_message_main_attachment_id_index' })
  @Property({ nullable: true })
  messageMainAttachmentId?: number;

  @Index({ name: 'hr_job_name_index' })
  @Property()
  name!: string;

  @Property({ nullable: true })
  sequence?: number;

  @Property({ nullable: true })
  expectedEmployees?: number;

  @Property({ nullable: true })
  noOfEmployee?: number;

  @Property({ nullable: true })
  noOfRecruitment?: number;

  @Property({ nullable: true })
  noOfHiredEmployee?: number;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @Property({ columnType: 'text', nullable: true })
  requirements?: string;

  @OneToOne({ entity: () => HrDepartment, onDelete: 'set null', nullable: true })
  department?: HrDepartment;

  @OneToOne({ entity: () => Organisation, onDelete: 'set null', nullable: true })
  organisation?: Organisation;

  @Property()
  state!: string;
}
