import { container, provideSingleton } from '@di/index';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { Contract } from '../models/Contract';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { ContractDTO } from '../dtos/ContractDTO';
import { UpdateContractDTO } from '../dtos/UpdateContractDTO';
import { ContractRO } from './RequestObject';
import { IContractService } from './../interfaces/IContractService';

@provideSingleton()
@Path('contracts')
export class ContractRoutes extends BaseRoutes<Contract> {
  constructor(private contractService: IContractService) {
    super(contractService as any, new ContractDTO(), new UpdateContractDTO());
  }

  static getInstance(): ContractRoutes {
    return container.get(ContractRoutes);
  }

  @POST
  @Path('create')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async createMember(payload: ContractRO): Promise<ContractDTO> {
    const result = await this.contractService.createContract(payload);

    if (result.isFailure) {
      return new ContractDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new ContractDTO().serialize({ body: { contractId: result.getValue(), statusCode: 201 } });
  }

  @PUT
  @Path('/update/:id')
  @Security('', KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async createUpdateMember(payload: ContractRO, @PathParam('id') id: number): Promise<ContractDTO> {
    const result = await this.contractService.updateContract(payload, id);

    if (result.isFailure) {
      return new ContractDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new ContractDTO().serialize({ body: { contractId: result.getValue(), statusCode: 204 } });
  }
}
