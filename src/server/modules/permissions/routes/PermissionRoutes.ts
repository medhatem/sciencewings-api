import { container, provideSingleton } from '@/di/index';
import { DELETE, Path, PathParam, POST, PUT, Security } from 'typescript-rest';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { CreatePermissionDTO, permissionGetDTO, UpdatePermissionDTO } from '@/modules/permissions/dtos/permissionDTO';
import { IPermissionService } from '@/modules/permissions/interfaces/IPermissionService';
import { Permission } from '@/modules/permissions/models/permission';
import { createPermissionRO, updatePermissionRO } from '@/modules/permissions/routes/RequestObject';

@provideSingleton()
@Path('permission')
export class PermissionRoutes extends BaseRoutes<Permission> {
  constructor(private PermissionService: IPermissionService) {
    super(PermissionService as any, new CreatePermissionDTO(), new permissionGetDTO());
  }

  static getInstance(): PermissionRoutes {
    return container.get(PermissionRoutes);
  }

  /**
   * @override create an permission in the database
   * @param payload Should contain the permission data
   */
  @POST
  @Path('create')
  @Security()
  @LoggerStorage()
  @Response<permissionGetDTO>(204, 'Permisssion created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createPermission(payload: createPermissionRO): Promise<CreatePermissionDTO> {
    const result = await this.PermissionService.createPermission(payload);

    return new CreatePermissionDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * update a permission in the database
   * @param payload Should contain the permission data
   * @param id of the permission data
   */
  @PUT
  @Path('update/:id')
  @Security()
  @LoggerStorage()
  @Response<permissionGetDTO>(204, 'Permisssion updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updatePermission(
    payload: updatePermissionRO,
    @PathParam('id') id: number,
  ): Promise<UpdatePermissionDTO> {
    const result = await this.PermissionService.updatePermission(payload, id);

    return new UpdatePermissionDTO({ body: { id: result, statusCode: 201 } });
  }
  /**
   * @override delete a permission in the database
   * @param id of the permission data
   */
  @DELETE
  @Path('delete/:id')
  @Security()
  @LoggerStorage()
  @Response<permissionGetDTO>(204, 'Permisssion deleted Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deletePermission(@PathParam('id') id: number): Promise<permissionGetDTO> {
    const result = await this.PermissionService.deletePermission(id);

    return new permissionGetDTO({ body: { id: result, statusCode: 201 } });
  }
}
