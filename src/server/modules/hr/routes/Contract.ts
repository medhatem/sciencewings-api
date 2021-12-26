import { container, provideSingleton } from '@di/index';
import { ContractService } from '../services/ContractService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Contract } from '../models/Contract';
import { Path, GET, QueryParam } from 'typescript-rest';

@provideSingleton()
@Path('employee')
export class ContractRoutes extends BaseRoutes<Contract> {
  constructor(private ContractRoutes: ContractService) {
    super(ContractRoutes);
  }

  static getInstance(): ContractRoutes {
    return container.get(ContractRoutes);
  }

  @GET
  @Path('newRoute')
  public async newRoute(@QueryParam('body') body: string) {
    return body;
  }
}
