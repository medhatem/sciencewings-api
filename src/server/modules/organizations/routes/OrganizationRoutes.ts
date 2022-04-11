import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Organization } from '@/modules/organizations/models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam, PUT } from 'typescript-rest';
import {
  CreateOrganizationRO,
  UserInviteToOrgRO,
  ResourceRO,
  ResourcesSettingsReservationGeneralRO,
  ResourceRateRO,
  ResourceTimerRestrictionRO,
  ResourcesSettingsReservationUnitRO,
  ResourceReservationVisibilityRO,
  UserResendPassword,
} from './RequestObject';
import { UserRequest } from '../../../types/UserRequest';
import { OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { UpdateOrganizationDTO } from '@/modules/organizations/dtos/UpdateOrganizationDTO';
import { InviteUserDTO } from '@/modules/organizations/dtos/InviteUserDTO';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { UserIdDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { OrganizationMembersDTO } from '@/modules/organizations/dtos/GetOrganizationsMembersDTO';
import {
  CreatedResourceBodyDTO,
  CreateResourceDTO,
  GetResourceBodyDTO,
  ResourceDTO,
  UpdateResourceBodyDTO,
  UpdateResourceDTO,
  GetResourceSettingsBodyDTO,
  GetResourceSettingsDTO,
} from '@/modules/resources/dtos/ResourceDTO';
import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';

@provideSingleton()
@Path('organization')
export class OrganizationRoutes extends BaseRoutes<Organization> {
  constructor(private OrganizationService: IOrganizationService) {
    super(OrganizationService as any, new OrganizationDTO(), new UpdateOrganizationDTO());
  }

  static getInstance(): OrganizationRoutes {
    return container.get(OrganizationRoutes);
  }

  @POST
  @Path('createOrganization')
  @Security()
  @LoggerStorage()
  @Response<OrganizationDTO>(201, 'Organization created Successfully')
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  public async createOrganization(
    payload: CreateOrganizationRO,
    @ContextRequest request: UserRequest,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.createOrganization(payload, request.userId);

    if (result.isFailure) {
      return new OrganizationDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }

  /**
   * invite a user to an organization
   * creates the newly invited user in keycloak
   *
   * @param payload
   */
  @POST
  @Path('inviteUserToOrganization')
  @Response<InviteUserDTO>(201, 'User Registred Successfully')
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  @Security()
  @LoggerStorage()
  public async inviteUserToOrganization(payload: UserInviteToOrgRO): Promise<InviteUserDTO> {
    const result = await this.OrganizationService.inviteUserByEmail(payload.email, payload.organizationId);
    if (result.isFailure) {
      return new InviteUserDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new InviteUserDTO({
      body: { statusCode: 201, id: result.getValue() },
    });
  }

  /**
   * resend the reset password email to the invited user
   *
   * @param payload
   *
   */
  @POST
  @Path('resendInvite')
  @Response<UserIdDTO>(200, 'invite resent successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @Security()
  @LoggerStorage()
  public async resendInvite(payload: UserResendPassword): Promise<InviteUserDTO> {
    const result = await this.OrganizationService.resendInvite(payload.userId, payload.orgId);

    if (result.isFailure) {
      return new InviteUserDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new InviteUserDTO({
      body: { statusCode: 200, id: result.getValue() },
    });
  }

  /**
   * retrive users that belongs to an organization
   *
   * @param id: organization id
   */
  @GET
  @Path('getMembers/:id')
  @Security()
  @LoggerStorage()
  @Response<OrganizationMembersDTO>(200, 'Return organization members Successfully')
  @Response<OrganizationMembersDTO>(500, 'Internal Server Error')
  public async getUsers(@PathParam('id') payload: number): Promise<OrganizationMembersDTO> {
    const result = await this.OrganizationService.getMembers(payload);

    if (result.isFailure) {
      return new OrganizationMembersDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationMembersDTO({ body: { members: result.getValue(), statusCode: 200 } });
  }

  /**
   * retrieve all the organizations owned by a given user
   *
   * @param id: user id
   */
  @GET
  @Path('getUserOrganizations/:id')
  @Security()
  @LoggerStorage()
  @Response<OrganizationDTO>(200, 'Return Organization that the users belongs to, Successfully')
  @Response<OrganizationDTO>(500, 'Internal Server Error')
  public async getUserOrganizations(@PathParam('id') payload: number): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.getUserOrganizations(payload);

    if (result.isFailure) {
      return new OrganizationDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new OrganizationDTO({ body: { id: result.getValue(), statusCode: 200 } });
  }

  // resource routes

  /**
   * Registers a new resource in the database
   *
   * @param payload
   * Should container Resource data that include Resource data
   */
  @POST
  @Path('resources/create')
  @Security()
  @Response<CreatedResourceBodyDTO>(201, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async createResource(payload: ResourceRO): Promise<CreateResourceDTO> {
    const result = await this.OrganizationService.createResource(payload);

    if (result.isFailure) {
      return new CreateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }

  /**
   * Update a resource in the database
   *
   * @param payload
   * Should container Resource data that include Resource data with its id
   */
  @PUT
  @Path('resources/update/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResource(payload: ResourceRO, @PathParam('id') id: number): Promise<UpdateResourceDTO> {
    const result = await this.OrganizationService.updateResource(payload, id);

    if (result.isFailure) {
      return new UpdateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * retrieve all resources of a given organization by id
   *
   * @param organizationId organization id
   */
  @GET
  @Path('resources/getOgranizationResourcesById/:organizationId')
  @Security()
  @LoggerStorage()
  @Response<GetResourceBodyDTO>(200, 'Resource Retrived Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async getOgranizationResources(@PathParam('organizationId') organizationId: number): Promise<ResourceDTO> {
    const result = await this.OrganizationService.getResourcesOfAGivenOrganizationById(organizationId);
    if (result.isFailure) {
      return new ResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new ResourceDTO({ body: { data: [...result.getValue()], statusCode: 200 } });
  }

  /**
   * Update a resource reservation settings general in the database
   *
   * @param payload
   * Should container Resource data that include Resource data with its id
   */
  @PUT
  @Path('/resources/settings/reservation/general/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResourcesSettingsReservationGeneral(
    payload: ResourcesSettingsReservationGeneralRO,
    @PathParam('id') id: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.OrganizationService.updateResourceReservationGeneral(payload, id);

    if (result.isFailure) {
      return new UpdateResourceDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * Update a resource reservation settings units in the database
   *
   * @param payload
   * Should container Resource data that include Resource data with its id
   */
  @PUT
  @Path('/resources/settings/reservation/unit/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Resource reservation unit settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateResourcesSettingsReservationUnit(
    payload: ResourcesSettingsReservationUnitRO,
    @PathParam('id') id: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.OrganizationService.updateResourceReservationUnits(payload, id);

    if (result.isFailure) {
      return new UpdateResourceDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * register a new resource rate in the database
   *
   * @param payload
   */
  @POST
  @Path('resources/settings/reservation/rate/:id')
  @Security()
  @Response<CreateResourceDTO>(201, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async createResourceRate(payload: ResourceRateRO, @PathParam('id') id: number): Promise<CreateResourceDTO> {
    const result = await this.OrganizationService.createResourceRate(payload, id);

    if (result.isFailure) {
      return new CreateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreateResourceDTO({ body: { id: result.getValue(), statusCode: 201 } });
  }

  /**
   * update resource rate in the database
   *
   * @param payload
   */
  @PUT
  @Path('resources/settings/reservation/rate/:id')
  @Security()
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async updateResourceRate(payload: ResourceRateRO, @PathParam('id') id: number): Promise<UpdateResourceDTO> {
    const result = await this.OrganizationService.updateResourceRate(payload, id);

    if (result.isFailure) {
      return new UpdateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * update resource time restriction in the database
   *
   * @param payload
   */
  @PUT
  @Path('resources/settings/reservation/time_restriction/:id')
  @Security()
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async updateResourceTimerRestriction(
    payload: ResourceTimerRestrictionRO,
    @PathParam('id') id: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.OrganizationService.updateResourceReservationTimerRestriction(payload, id);

    if (result.isFailure) {
      return new UpdateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * update resource time restriction in the database
   *
   * @param payload
   */
  @PUT
  @Path('resources/settings/reservation/visibility/:id')
  @Security()
  @Response<UpdateResourceBodyDTO>(204, 'Resource created Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  @LoggerStorage()
  public async updateResourceRestrictionVisibility(
    payload: ResourceReservationVisibilityRO,
    @PathParam('id') id: number,
  ): Promise<UpdateResourceDTO> {
    const result = await this.OrganizationService.updateResourceReservationVisibility(payload, id);

    if (result.isFailure) {
      return new UpdateResourceDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new UpdateResourceDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }

  /**
   * Get a resource settings in the database
   *
   * @param payload
   * Should container Resource data that include Resource data with its id
   */
  @GET
  @Path('/resources/settings/:id')
  @Security()
  @LoggerStorage()
  @Response<GetResourceSettingsBodyDTO>(204, 'Resource reservation general settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async getResourceSettings(@PathParam('id') id: number): Promise<GetResourceSettingsDTO> {
    const result = await this.OrganizationService.getResourceSettings(id);

    if (result.isFailure) {
      return new GetResourceSettingsDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new GetResourceSettingsDTO({ body: { ...result.getValue(), statusCode: 200 } });
  }
}
