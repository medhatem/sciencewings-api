import { Entity, Index, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ResGroups } from './ResGroups';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({ name: 'res_groups_report_rel_gid_uid_idx', properties: ['uid', 'gid'] })
export class ResGroupsReportRel {
  @PrimaryKey()
  uid!: number;

  @ManyToOne({ entity: () => ResGroups, fieldName: 'gid', onDelete: 'cascade', primary: true })
  gid!: ResGroups;
}
