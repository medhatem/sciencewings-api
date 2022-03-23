import { Entity, Index, ManyToOne } from '@mikro-orm/core';

import { ResGroups } from '@/modules/users/models/ResGroups';
import { User } from '@/modules/users/models/User';
import { provide } from '@/di/index';

@provide()
@Entity()
@Index({ name: 'res_groups_users_rel_uid_gid_idx', properties: ['gid', 'uid'] })
export class ResGroupsUsersRel {
  @ManyToOne({ entity: () => ResGroups, fieldName: 'gid', onDelete: 'cascade', primary: true })
  gid!: ResGroups;

  @ManyToOne({ entity: () => User, fieldName: 'uid', onDelete: 'cascade', primary: true })
  uid!: User;
}
