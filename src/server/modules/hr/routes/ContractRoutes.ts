import { container, provideSingleton } from '@/di/index';
import { ContractService } from '../services/ContractService';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Contract } from '@/modules/hr/models/Contract';
import { Path, GET, QueryParam } from 'typescript-rest';
import { ContractDTO } from '@/modules/hr/dtos/ContractDTO';
import { UpdateContractDTO } from '@/modules/hr/dtos/UpdateContractDTO';

@provideSingleton()
@Path('contracts')
export class ContractRoutes extends BaseRoutes<Contract> {
  constructor(private ContractRoutes: ContractService) {
    super(ContractRoutes, new ContractDTO(), new UpdateContractDTO());
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
