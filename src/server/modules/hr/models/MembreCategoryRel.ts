import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Membre } from './Membre';
import { MembreCategory } from './MembreCategory';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({ name: 'membre_category_rel_category_id_emp_id_idx', properties: ['emp', 'category'] })
export class MembreCategoryRel {
  @ManyToOne({ entity: () => Membre, onDelete: 'cascade', primary: true })
  emp!: Membre;

  @ManyToOne({ entity: () => MembreCategory, onDelete: 'cascade', primary: true })
  category!: MembreCategory;
}
