import { Entity, Index, ManyToOne } from '@mikro-orm/core';

import { Organization } from './Organization';
import { User } from '@modules/users/models/User';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({ name: 'res_organization_users_rel_user_id_cid_idx', properties: ['cid', 'user'] })
export class OrganizationUsersRel {
  @ManyToOne({ entity: () => Organization, fieldName: 'cid', onDelete: 'cascade', primary: true })
  cid!: Organization;

  @ManyToOne({ entity: () => User, onDelete: 'cascade', primary: true })
  user!: User;
}
