import { container, provideSingleton } from '@di/index';
import { EmployeeService } from '../services/EmployeeService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Employee } from '../models/Employee';
import { Path, GET, QueryParam } from 'typescript-rest';
import { EmployeeDTO } from '../dtos/EmployeeDTO';

@provideSingleton()
@Path('employee')
export class EmployeeRoutes extends BaseRoutes<Employee, EmployeeDTO> {
  constructor(private EmployeeRoutes: EmployeeService) {
    super(EmployeeRoutes, EmployeeDTO);
    console.log(this.EmployeeRoutes);
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
