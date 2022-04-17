import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Organization } from '@/modules/organizations/models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam, PUT } from 'typescript-rest';
import {
  CreateOrganizationRO,
  UserInviteToOrgRO,
  ResourceRO,
  UserResendPassword,
  OrganizationGeneralSettingsRO,
  OrganizationReservationSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationAccessSettingsRO,
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
} from '@/modules/resources/dtos/ResourceDTO';
import { BaseErrorDTO } from '@/modules/base/dtos/BaseDTO';
import {
  GetOrganizationSettingsBodyDTO,
  GetOrganizationSettingsDTO,
  UpdateOrganizationSettingsBodyDTO,
  UpdateOrganizationSettingsDTO,
} from '../dtos/OrganizationSettingsDto';

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
   * Should contain Resource data that include Resource data
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
   * Should contain Resource data that include Resource data with its id
   * @param id
   * id of the requested resource
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

  //Organization settings routes

  /**
   * retrieve Organization settings route by organization id
   *
   * @param organizationId organization id
   */
  @GET
  @Path('settings/:id')
  @Security()
  @LoggerStorage()
  @Response<GetOrganizationSettingsBodyDTO>(200, 'Organization Settings Retrived Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async getOgranizationSettings(@PathParam('id') id: number): Promise<GetOrganizationSettingsDTO> {
    const result = await this.OrganizationService.getOrganizationSettingsById(id);
    if (result.isFailure) {
      return new GetOrganizationSettingsDTO({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new GetOrganizationSettingsDTO({ body: { ...result.getValue(), statusCode: 200 } });
  }
  /* Update a organization settings, section general
   *
   * @param payload
   * @param id of the requested resource
   *
   */
  @PUT
  @Path('settings/general/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization general settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateOrganizationsSettingsnGeneralProperties(
    payload: OrganizationGeneralSettingsRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsnGeneralProperties(payload, id);

    if (result.isFailure) {
      return new UpdateOrganizationSettingsDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateOrganizationSettingsDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
  /* Update a organization settings, section reservation
   *
   * @param payload
   * @param id of the requested resource
   *
   */
  @PUT
  @Path('settings/reservation/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization reservation  settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateOrganizationsSettingsnReservationProperties(
    payload: OrganizationReservationSettingsRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, id);

    if (result.isFailure) {
      return new UpdateOrganizationSettingsDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateOrganizationSettingsDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
  /* Update a organization settings, section invoices
   *
   * @param payload
   * @param id of the requested organization
   *
   */
  @PUT
  @Path('settings/invoices/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization invoices settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateOrganizationsSettingsnInvoicesProperties(
    payload: OrganizationInvoicesSettingsRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, id);

    if (result.isFailure) {
      return new UpdateOrganizationSettingsDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateOrganizationSettingsDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
  /* Update a organization settings, section access
   *
   * @param payload
   * @param id
   * id of the requested resource
   */
  @PUT
  @Path('settings/access/:id')
  @Security()
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization access  settings updated Successfully')
  @Response<BaseErrorDTO>(500, 'Internal Server Error')
  public async updateOrganizationsSettingsnAccessProperties(
    payload: OrganizationAccessSettingsRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, id);

    if (result.isFailure) {
      return new UpdateOrganizationSettingsDTO({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new UpdateOrganizationSettingsDTO({ body: { id: result.getValue(), statusCode: 204 } });
  }
}
