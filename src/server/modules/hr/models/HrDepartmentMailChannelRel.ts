import { Entity, Index, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { HrDepartment } from './HrDepartment';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({
  name: 'hr_department_mail_channel_re_hr_department_id_mail_channel_idx',
  properties: ['mailChannelId', 'hrDepartment'],
})
export class HrDepartmentMailChannelRel {
  @PrimaryKey()
  mailChannelId!: number;

  @ManyToOne({ entity: () => HrDepartment, onDelete: 'cascade', primary: true })
  hrDepartment!: HrDepartment;
}
