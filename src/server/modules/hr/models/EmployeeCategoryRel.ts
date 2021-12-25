import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { HrEmployee } from './HrEmployee';
import { HrEmployeeCategory } from './HrEmployeeCategory';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({ name: 'employee_category_rel_category_id_emp_id_idx', properties: ['emp', 'category'] })
export class EmployeeCategoryRel {
  @ManyToOne({ entity: () => HrEmployee, onDelete: 'cascade', primary: true })
  emp!: HrEmployee;

  @ManyToOne({ entity: () => HrEmployeeCategory, onDelete: 'cascade', primary: true })
  category!: HrEmployeeCategory;
}
