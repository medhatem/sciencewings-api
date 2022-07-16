import { container, provideSingleton } from '@/di/index';
import { Path, PathParam, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { CreateInfrustructureDTO, UpdateInfrustructureDTO } from '@/modules/infrastructure/dtos/InfrustructureDTO';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { InfrustructureRO } from './RequestObject';

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
   * Update a resource in the database
   *
   * @param payload
   * Should contain Resource data that include Resource data with its id
   * @param id
   * id of the requested resource
   */
  @PUT
  @Path('update/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateInfrustructureDTO>(204, 'infrastructure updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateinfrastructure(
    payload: InfrustructureRO,
    @PathParam('id') id: number,
  ): Promise<UpdateInfrustructureDTO> {
    const result = await this.InfrastructureService.updateinfrastructure(payload, id);
    if (result.isFailure) {
      throw result.error;
    }
    return new UpdateInfrustructureDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
}
