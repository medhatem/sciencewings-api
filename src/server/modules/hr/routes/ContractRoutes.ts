import { IContractService } from '@/modules/hr/interfaces/IContractService';
import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Contract } from '@/modules/hr/models/Contract';
import { GET, Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import {
  AllContractsBaseDTO,
  ContracBaseBodyDTO,
  ContracBaseDTO,
  UpdateContracBaseDTO,
} from '@/modules/hr/dtos/ContractDTO';
import { UpdateContractRO, CreateContractRO } from '@/modules/hr/routes/RequestObject';
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
   * Retrieve all member contracts
   * @param orgId of organization id
   * @param userId of user id
   */
  @GET
  @Path('/:orgId/:userId')
  @Security()
  @LoggerStorage()
  @Response<AllContractsBaseDTO>(200, 'Contracts extract Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getAllMemberContracts(
    @PathParam('orgId') orgId: number,
    @PathParam('userId') userId: number,
  ): Promise<AllContractsBaseDTO> {
    const result = await this.contractService.getAllMemberContracts(orgId, userId);
    return new AllContractsBaseDTO({ body: { data: [...(result || [])], statusCode: 200 } });
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
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createContract(payload: CreateContractRO): Promise<ContracBaseDTO> {
    const result = await this.contractService.createContract(payload);

    return new ContracBaseDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * Override the update method
   * @param payload updated properties
   * @param id of updated contract
   */
  @PUT
  @Path('/update/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateContracBaseDTO>(204, 'Contract updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createUpdateContract(
    payload: UpdateContractRO,
    @PathParam('id') id: number,
  ): Promise<UpdateContracBaseDTO> {
    const result = await this.contractService.updateContract(payload, id);
    return new UpdateContracBaseDTO({ body: { id: result, statusCode: 204 } });
  }
}
