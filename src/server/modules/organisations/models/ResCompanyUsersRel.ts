import { Entity, Index, ManyToOne } from '@mikro-orm/core';

import { Organization } from './Organization';
import { User } from '../../users/models/User';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({ name: 'res_organisation_users_rel_user_id_cid_idx', properties: ['cid', 'user'] })
export class OrganisationUsersRel {
  @ManyToOne({ entity: () => Organization, fieldName: 'cid', onDelete: 'cascade', primary: true })
  cid!: Organization;

  @ManyToOne({ entity: () => User, onDelete: 'cascade', primary: true })
  user!: User;
}
