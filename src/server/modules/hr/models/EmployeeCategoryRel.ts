import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Employee } from './Employee';
import { EmployeeCategory } from './EmployeeCategory';
import { provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
@Index({ name: 'employee_category_rel_category_id_emp_id_idx', properties: ['emp', 'category'] })
export class EmployeeCategoryRel {
  @ManyToOne({ entity: () => Employee, onDelete: 'cascade', primary: true })
  emp!: Employee;

  @ManyToOne({ entity: () => EmployeeCategory, onDelete: 'cascade', primary: true })
  category!: EmployeeCategory;
}
