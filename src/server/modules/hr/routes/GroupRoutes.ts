import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Group } from '@/modules/hr/models/Group';
import { Path, PathParam, POST, PUT, Security, DELETE, GET, QueryParam } from 'typescript-rest';
import {
  GroupDTO,
  CreateGroupDTO,
  UpdateGroupDTO,
  OrgGroupsrequestDTO,
  groupMembersrequestDTO,
} from '@/modules/hr/dtos/GroupDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { GroupRO } from '@/modules/hr/routes/RequestObject';
import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { Response } from 'typescript-rest-swagger';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';

@provideSingleton()
@Path('groups')
export class GroupRoutes extends BaseRoutes<Group> {
  constructor(private groupService: IGroupService) {
    super(groupService as any, new CreateGroupDTO(), new UpdateGroupDTO());
  }

  static getInstance(): GroupRoutes {
    return container.get(GroupRoutes);
  }

  /**
   * get organization groups
   * @param payload
   * @param page: queryParam to specify page the client want
   * @param size: queryParam to specify the size of one page
   * @returns the created group id
   * @param query of type string used to do the search
   */
  @GET
  @Path('getOrganizationGroup/:organizationId')
  @Security(['{orgId}-view-organization-groups', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GroupRO>(200, 'Group fetched Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationGroup(
    @PathParam('organizationId') organizationId: number,
    @QueryParam('page') page?: number,
    @QueryParam('size') size?: number,
    @QueryParam('query') query?: string,
  ): Promise<OrgGroupsrequestDTO> {
    const result = await this.groupService.getOrganizationGroup(
      organizationId,
      page || null,
      size || null,
      query || null,
    );

    if (result?.pagination)
      return new OrgGroupsrequestDTO({
        body: { data: result.data, pagination: result.pagination, statusCode: 200 },
      });
    else
      return new OrgGroupsrequestDTO({
        body: { data: result.data, statusCode: 200 },
      });
  }

  /**
   * create a group
   * @param payload
   * @returns the created group id
   */
  @POST
  @Path('create')
  @Security(['{orgId}-create-group', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GroupRO>(201, 'Group created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  public async createGroup(payload: GroupRO): Promise<GroupDTO> {
    const result = await this.groupService.createGroup(payload);
    return new GroupDTO({ body: { id: result, statusCode: 201 } });
  }

  /**
   * update group by id
   * @param payload
   * @param id
   * @returns the updated group id
   */
  @PUT
  @Path('/update/:id')
  @Security(['{orgId}-update-group', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateGroup(payload: GroupRO, @PathParam('id') id: number): Promise<GroupDTO> {
    const result = await this.groupService.updateGroup(payload, id);

    return new GroupDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * add group memebers by id
   * @param userId the member user id
   * @param groupId the group id
   */
  @POST
  @Path('/groupMember/:groupId/:userId')
  @Security(['{orgId}-update-group-members', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateGroupMember(
    @PathParam('userId') userId: number,
    @PathParam('groupId') groupId: number,
  ): Promise<GroupDTO> {
    const result = await this.groupService.addGroupMember(userId, groupId);

    return new GroupDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * delete group memebers by id
   * @param userId the member user id
   * @param groupid the group id
   */
  @DELETE
  @Path('/groupMember/:groupId/:userId')
  @Security(['{orgId}-delete-group-members', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deleteGroupMember(
    @PathParam('userId') userId: number,
    @PathParam('groupId') groupId: number,
  ): Promise<GroupDTO> {
    const result = await this.groupService.deleteGroupMember(userId, groupId);

    return new GroupDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * delete group by id
   * @param payload
   * @param id
   * @returns the deleted group id
   */
  @DELETE
  @Path('/delete/:id')
  @Security(['{orgId}-delete-group', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GroupDTO>(204, 'Group deleted Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deleteGroup(@PathParam('id') id: number): Promise<GroupDTO> {
    const result = await this.groupService.deleteGroup(id);

    return new GroupDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * get group members
   * @param groupId
   */
  @GET
  @Path(':groupId/members')
  @Security(['{orgId}-view-group-members', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GroupRO>(200, 'members fetched Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getGroupMembers(@PathParam('groupId') groupId: number): Promise<groupMembersrequestDTO> {
    const result = await this.groupService.getGroupMembers(groupId);

    return new groupMembersrequestDTO({ body: { data: [...(result || [])], statusCode: 201 } });
  }
}
