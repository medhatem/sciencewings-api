import { IContractService } from '@/modules/hr/interfaces/IContractService';
import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Contract } from '@/modules/hr/models/Contract';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { ContracBaseBodyDTO, ContracBaseDTO, UpdateContracBaseDTO } from '@/modules/hr/dtos/ContractDTO';
import { ContractRO } from './RequestObject';
import { Response } from 'typescript-rest-swagger';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
@provideSingleton()
@Path('contracts')
export class ContractRoutes extends BaseRoutes<Contract> {
  constructor(private contractService: IContractService) {
    super(contractService as any, new ContracBaseDTO(), new UpdateContracBaseDTO());
  }

  static getInstance(): ContractRoutes {
    return container.get(ContractRoutes);
  }

  /**
   * Override the create method
   */
  @POST
  @Path('create')
  @Security()
  @LoggerStorage()
  @Response<ContracBaseBodyDTO>(201, 'Contract created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  public async createContract(payload: ContractRO): Promise<ContracBaseDTO> {
    const result = await this.contractService.createContract(payload);

    if (result.isFailure) {
      throw result.error;
    }

    return new ContracBaseDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }

  /**
   * Override the update method
   */
  @PUT
  @Path('/update/:id')
  @Security()
  @LoggerStorage()
  @Response<ContracBaseBodyDTO>(204, 'Contract updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createUpdateContract(payload: ContractRO, @PathParam('id') id: number): Promise<ContracBaseDTO> {
    const result = await this.contractService.updateContract(payload, id);

    if (result.isFailure) {
      throw result.error;
    }

    return new ContracBaseDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
}
