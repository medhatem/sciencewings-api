import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Organization } from '@/modules/organizations/models/Organization';
import { User } from '@/modules/users/models/User';
import { provide } from '@/di/index';

@provide()
@Entity()
@Index({ name: 'organization_users_rel_user_id_cid_idx', properties: ['cid', 'user'] })
export class OrganizationUsersRel {
  @ManyToOne({
    entity: () => Organization,
    fieldName: 'cid',
    onDelete: 'cascade',
    primary: true,
    unique: false,
  })
  cid!: Organization;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    primary: true,
    unique: false,
  })
  user!: User;
}
