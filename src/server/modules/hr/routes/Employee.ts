import { container, provideSingleton } from '@di/index';
import { EmployeeService } from '../services/EmployeeService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Employee } from '../models/Employee';
import { Path, GET, QueryParam } from 'typescript-rest';

@provideSingleton()
@Path('employee')
export class EmployeeRoutes extends BaseRoutes<Employee> {
  constructor(private EmployeeRoutes: EmployeeService) {
    super(EmployeeRoutes);
  }

  static getInstance(): EmployeeRoutes {
    return container.get(EmployeeRoutes);
  }

  @GET
  @Path('newRoute')
  public async newRoute(@QueryParam('body') body: string) {
    return body;
  }
}
