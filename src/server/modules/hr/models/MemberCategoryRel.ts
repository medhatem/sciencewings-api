import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Member } from './Member';
import { MemberCategory } from './MemberCategory';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({ name: 'member_category_rel_category_id_emp_id_idx', properties: ['emp', 'category'] })
export class MemberCategoryRel {
  @ManyToOne({ entity: () => Member, onDelete: 'cascade', primary: true })
  emp!: Member;

  @ManyToOne({ entity: () => MemberCategory, onDelete: 'cascade', primary: true })
  category!: MemberCategory;
}
