import { Entity, Index, ManyToOne } from '@mikro-orm/core';

import { ResGroups } from '@/modules/users/models/ResGroups';
import { provide } from '@/di/index';

@provide()
@Entity()
@Index({ name: 'res_groups_implied_rel_hid_gid_idx', properties: ['gid', 'hid'] })
export class ResGroupsImpliedRel {
  @ManyToOne({
    entity: () => ResGroups,
    fieldName: 'gid',
    onDelete: 'cascade',
    primary: true,
    unique: false,
  })
  gid!: ResGroups;

  @ManyToOne({
    entity: () => ResGroups,
    fieldName: 'hid',
    onDelete: 'cascade',
    primary: true,
    unique: false,
  })
  hid!: ResGroups;
}
