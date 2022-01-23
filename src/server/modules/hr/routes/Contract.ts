import { container, provideSingleton } from '@di/index';
import { ContractService } from '../services/ContractService';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Contract } from '../models/Contract';
import { Path, GET, QueryParam } from 'typescript-rest';
import { ContractDTO } from '../dtos/ContractDTO';

@provideSingleton()
@Path('employee')
export class ContractRoutes extends BaseRoutes<Contract, ContractDTO> {
  constructor(private ContractRoutes: ContractService) {
    super(ContractRoutes, ContractDTO);
    console.log(this.ContractRoutes);
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
