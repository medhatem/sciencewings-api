import { container, provideSingleton } from '@di/index';

import { BaseDao } from '../../base/daos/BaseDao';
import { Employee } from '@modules/hr/models/Employee';

@provideSingleton()
export class EmployeeDao extends BaseDao<Employee> {
  private constructor(public model: Employee) {
    super(model);
  }

  static getInstance(): EmployeeDao {
    return container.get(EmployeeDao);
  }
}
