import { container, provideSingleton } from '@/di/index';
import { Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { InfrastructureRO, UpdateinfrastructureRO } from '@/modules/infrastructure/routes/RequestObject';
import {
  CreateInfrastructureDTO,
  infrastructureGetDTO,
  UpdateInfrastructureDTO,
} from '@/modules/infrastructure/dtos/InfrastructureDTO';

@provideSingleton()
@Path('infrastructure')
export class InfrastructureRoutes extends BaseRoutes<Infrastructure> {
  constructor(private InfrastructureService: IInfrastructureService) {
    super(InfrastructureService as any, new CreateInfrastructureDTO(), new infrastructureGetDTO());
  }

  static getInstance(): InfrastructureRoutes {
    return container.get(InfrastructureRoutes);
  }

  /**
   * @override
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
  @Response<infrastructureGetDTO>(204, 'infrastructure created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createInfrastructure(payload: InfrastructureRO): Promise<CreateInfrastructureDTO> {
    const result = await this.InfrastructureService.createInfrustructure(payload);

    return new CreateInfrastructureDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * @override
   * Update a infrustructure in the database
   *
   * @param payload
   * Should contain infrustructure data that include infrustructure data with its id
   * @param id
   * id of the requested infrustructure
   *
   */
  @PUT
  @Path('update/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateInfrastructureDTO>(204, 'infrastructure updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateinfrastructure(
    payload: UpdateinfrastructureRO,
    @PathParam('id') id: number,
  ): Promise<UpdateInfrastructureDTO> {
    const result = await this.InfrastructureService.updateInfrastructure(payload, id);

    return new UpdateInfrastructureDTO({ body: { id: result, statusCode: 204 } });
  }
}
