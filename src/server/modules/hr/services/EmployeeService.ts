import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Employee } from '@modules/hr/models/Employee';
import { EmployeeDao } from '../daos/EmployeeDao';

@provideSingleton()
export class EmployeeService extends BaseService<Employee> {
  constructor(public dao: EmployeeDao) {
    super(dao);
  }

  static getInstance(): EmployeeService {
    return container.get(EmployeeService);
  }
}
