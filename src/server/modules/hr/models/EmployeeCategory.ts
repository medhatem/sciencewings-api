import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseModel } from '../../base/models/BaseModel';
import { container, provideSingleton } from '@di/index';

@provideSingleton()
@Entity()
export class EmployeeCategory extends BaseModel<EmployeeCategory> {
  constructor() {
    super();
  }

  static getInstance(): EmployeeCategory {
    return container.get(EmployeeCategory);
  }

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'hr_employee_category_name_uniq' })
  @Property()
  name!: string;

  @Property({ nullable: true })
  color?: number;
}
