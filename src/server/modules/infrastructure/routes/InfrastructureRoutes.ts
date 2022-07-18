import { container, provideSingleton } from '@/di/index';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import {
  CreateInfrustructureDTO,
  InfrustructureBaseBodyGetDTO,
  UpdateInfrustructureBodyDTO,
  UpdateInfrustructureDTO,
} from '@/modules/infrastructure/dtos/InfrustructureDTO';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { InfrustructureRO, UpdateinfrastructureRO } from './RequestObject';

@provideSingleton()
@Path('infrustructure')
export class InfrastructureRoutes extends BaseRoutes<Infrastructure> {
  constructor(private InfrastructureService: IInfrastructureService) {
    super(InfrastructureService as any, new CreateInfrustructureDTO(), new UpdateInfrustructureDTO());
  }

  static getInstance(): InfrastructureRoutes {
    return container.get(InfrastructureRoutes);
  }

  /**
   * create an infrustructure in the database
   *
   * @param payload
   * Should contain infrustructure data
   *
   */
  @POST
  @Path('create')
  @Security()
  @LoggerStorage()
  @Response<InfrustructureBaseBodyGetDTO>(204, 'infrastructure created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createInfrastructure(payload: InfrustructureRO): Promise<CreateInfrustructureDTO> {
    const result = await this.InfrastructureService.createInfrustructure(payload);
    if (result.isFailure) {
      throw result.error;
    }
    return new CreateInfrustructureDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * Update a infrustructure in the database
   *
   * @param payload
   * Should contain infrustructure data that include infrustructure data with its id
   * @param id
   * id of the requested infrustructure
   */
  @PUT
  @Path('update/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateInfrustructureBodyDTO>(204, 'infrastructure updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateinfrastructure(
    payload: UpdateinfrastructureRO,
    @PathParam('id') id: number,
  ): Promise<UpdateInfrustructureDTO> {
    const result = await this.InfrastructureService.updateInfrastructure(payload, id);
    if (result.isFailure) {
      throw result.error;
    }
    return new UpdateInfrustructureDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
}
