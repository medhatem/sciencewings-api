import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Organization } from '@/modules/organizations/models/Organization';
import { Path, POST, Security, ContextRequest, GET, PathParam, PUT, DELETE, QueryParam } from 'typescript-rest';
import {
  CreateOrganizationRO,
  OrganizationAccessSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationlocalisationSettingsRO,
  OrganizationMemberSettingsRO,
  OrganizationReservationSettingsRO,
  UpdateOrganizationRO,
} from './RequestObject';
import { UserRequest } from '@/types/UserRequest';
import { CreateOrganizationDTO } from '@/modules/organizations/dtos/CreateOrganizationDTO';
import { GetOrganizationDTO, OrganizationDTO } from '@/modules/organizations/dtos/OrganizationDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { Response } from 'typescript-rest-swagger';
import { UpdateOrganizationDTO } from '@/modules/organizations/dtos/UpdateOrganizationDTO';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { OrganizationMembersDTO } from '@/modules/organizations/dtos/GetOrganizationsMembersDTO';
import { UpdateResourceBodyDTO } from '@/modules/resources/dtos/ResourceDTO';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { PhoneBaseBodyDTO, PhoneDTO } from '@/modules/phones/dtos/PhoneDTO';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { AddressBaseDTO, AddressBodyDTO } from '@/modules/address/dtos/AddressDTO';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import {
  GetOrganizationSettingsBodyDTO,
  GetOrganizationSettingsDTO,
  UpdateOrganizationSettingsBodyDTO,
  UpdateOrganizationSettingsDTO,
} from '@/modules/organizations/dtos/OrganizationSettingsDTO';
import { GetOrganizationLoclisationSettingsDTO } from '@/modules/organizations/dtos/localisationSettingsDTO';

@provideSingleton()
@Path('organization')
export class OrganizationRoutes extends BaseRoutes<Organization> {
  constructor(private OrganizationService: IOrganizationService) {
    super(OrganizationService as any, new OrganizationDTO(), new UpdateOrganizationDTO());
  }

  static getInstance(): OrganizationRoutes {
    return container.get(OrganizationRoutes);
  }
  /**
   * organization by id
   *
   * @param id organization id
   */
  @GET
  @Path('/:id')
  @Security(['{orgId}-view-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GetOrganizationDTO>(200, 'Organization Settings Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationById(@PathParam('id') id: number): Promise<GetOrganizationDTO> {
    const result = await this.OrganizationService.getOrganizationById(id);
    return new GetOrganizationDTO({ body: { ...result, statusCode: 200 } });
  }

  @POST
  @Path('createOrganization')
  @Security()
  @LoggerStorage()
  @Response<CreateOrganizationDTO>(201, 'Organization created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async createOrganization(
    payload: CreateOrganizationRO,
    @ContextRequest request: UserRequest,
  ): Promise<CreateOrganizationDTO> {
    const result = await this.OrganizationService.createOrganization(payload, request.userId);
    return new CreateOrganizationDTO({ body: { id: result, statusCode: 201 } });
  }
  /**
   * Update an organization in the database
   *
   * @param payload Should contain general data Organization
   * @param id  id of the updated organization
   *
   */
  @PUT
  @Path('updateOrganization/:id')
  @Security(['{orgId}-update-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateOrganizationDTO>(204, 'Organization updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganization(
    payload: UpdateOrganizationRO,
    @PathParam('id') id: number,
  ): Promise<UpdateOrganizationDTO> {
    const result = await this.OrganizationService.updateOrganizationGeneraleProperties(payload, id);
    return new UpdateOrganizationDTO({ body: { id: result, statusCode: 204 } });
  }
  /**
   * Delete an organization in the database
   *
   * @param id  id of the delete organization
   *
   */
  @DELETE
  @Path('delete/:id')
  @Security(['{orgId}-delete-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateResourceBodyDTO>(204, 'Organization delted Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async deleteOrganization(
    payload: UpdateOrganizationRO,
    @PathParam('id') id: number,
  ): Promise<OrganizationDTO> {
    const result = await this.OrganizationService.deleteOrganization(id);

    return new OrganizationDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * add an phone to a given organization
   *
   * @param payload Should contain new organization phone details
   *
   * @param id id of the updated organization
   *
   */
  @POST
  @Path('phone/:id')
  @Security(['{orgId}-update-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<PhoneBaseBodyDTO>(204, 'Organization phone created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async CreateOrganizationPhone(payload: PhoneRO, @PathParam('id') id: number): Promise<PhoneDTO> {
    const result = await this.OrganizationService.addPhoneToOrganization(payload, id);

    return new PhoneDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * create a new organization address in the database
   *
   * @param payload add phone to organization as a name
   *
   * @param id id of the updated organization
   *
   */
  @POST
  @Path('address/:id')
  @Security(['{orgId}-update-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<AddressBodyDTO>(204, 'Organization address created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async CreateOrganizationAdress(payload: AddressRO, @PathParam('id') id: number): Promise<AddressBaseDTO> {
    const result = await this.OrganizationService.addAddressToOrganization(payload, id);

    return new AddressBaseDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * retrive users that belongs to an organization
   * @param id: organization id
   * @param status: queryParam to fetch accepted or pending members
   * @param page: queryParam to specify page the client want
   * @param size: queryParam to specify the size of one page
   * @param query of type string used to do the search
   */
  @GET
  @Path('getMembers/:id')
  @Security(['{orgId}-view-organization-members', '{orgId}-admin'])
  @LoggerStorage()
  @Response<OrganizationMembersDTO>(200, 'Return organization members Successfully')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getUsers(
    @PathParam('id') payload: number,
    @QueryParam('status') status?: string,
    @QueryParam('page') page?: number,
    @QueryParam('size') size?: number,
    @QueryParam('query') query?: string,
  ): Promise<OrganizationMembersDTO> {
    const result = await this.OrganizationService.getMembers(
      payload,
      status || null,
      page || null,
      size || null,
      query || null,
    );
    if (result?.pagination)
      return new OrganizationMembersDTO({
        body: { data: result.data, pagination: result.pagination, statusCode: 200 },
      });
    else
      return new OrganizationMembersDTO({
        body: { data: result.data, statusCode: 200 },
      });
  }

  /**
   * retrieve Organization settings by organization id
   *
   * @param organizationId organization id
   */
  @GET
  @Path('settings/:organizationId')
  @Security(['{orgId}-view-organization-settings', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GetOrganizationSettingsBodyDTO>(200, 'Organization Settings Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationSettings(
    @PathParam('organizationId') organizationId: number,
  ): Promise<GetOrganizationSettingsDTO> {
    const result = await this.OrganizationService.getOrganizationSettingsById(organizationId);

    return new GetOrganizationSettingsDTO({ body: { data: result, statusCode: 200 } });
  }

  /* Update a organization settings, section members
   *
   * @param payload
   * @param organizationId of the requested resource
   *
   */
  @PUT
  @Path('settings/member/:organizationId')
  @Security(['{orgId}-update-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization reservation  settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsSettingsnMembersProperties(
    payload: OrganizationMemberSettingsRO,
    @PathParam('organizationId') organizationId: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, organizationId);

    return new UpdateOrganizationSettingsDTO({ body: { id: result, statusCode: 204 } });
  }

  /* Update a organization settings, section reservation
   *
   * @param payload
   * @param organizationId is the is of requested resource
   *
   */
  @PUT
  @Path('settings/reservation/:organizationId')
  @Security(['{orgId}-update-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization reservation  settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsSettingsnReservationProperties(
    payload: OrganizationReservationSettingsRO,
    @PathParam('organizationId') organizationId: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, organizationId);

    return new UpdateOrganizationSettingsDTO({ body: { id: result, statusCode: 204 } });
  }

  /* Update a organization settings, section invoices
   *
   * @param payload
   * @param organizationId is the is of the resource
   *
   */
  @PUT
  @Path('settings/invoices/:organizationId')
  @Security(['{orgId}-update-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization invoices settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsSettingsnInvoicesProperties(
    payload: OrganizationInvoicesSettingsRO,
    @PathParam('organizationId') organizationId: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, organizationId);

    return new UpdateOrganizationSettingsDTO({ body: { id: result, statusCode: 204 } });
  }

  /* Update a organization settings, section access
   *
   * @param payload
   * @param organizationId is the is of requested resource
   *
   */
  @PUT
  @Path('settings/access/:organizationId')
  @Security(['{orgId}-update-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization access  settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsSettingsnAccessProperties(
    payload: OrganizationAccessSettingsRO,
    @PathParam('organizationId') organizationId: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationsSettingsProperties(payload, organizationId);

    return new UpdateOrganizationSettingsDTO({ body: { id: result, statusCode: 204 } });
  }

  /* Update a organization settings, section localization
   *
   * @param payload
   * @param organizationId is the is of requested resource
   *
   */
  @PUT
  @Path('settings/localisation/:organizationId')
  @Security(['{orgId}-update-organization', '{orgId}-admin'])
  @LoggerStorage()
  @Response<UpdateOrganizationSettingsBodyDTO>(204, 'Organization localisation  settings updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateOrganizationsLocalisationSettingsProperties(
    payload: OrganizationlocalisationSettingsRO,
    @PathParam('organizationId') organizationId: number,
  ): Promise<UpdateOrganizationSettingsDTO> {
    const result = await this.OrganizationService.updateOrganizationLocalisationSettings(payload, organizationId);

    return new UpdateOrganizationSettingsDTO({ body: { id: result, statusCode: 204 } });
  }

  /**
   * retrieve Organization localisation settings by organization id
   *
   * @param organizationId organization id
   */
  @GET
  @Path('localizationSettings/:organizationId')
  @Security(['{orgId}-view-organization-localisation-settings', '{orgId}-admin'])
  @LoggerStorage()
  @Response<GetOrganizationLoclisationSettingsDTO>(200, 'Organization localisation Settings Retrived Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getOrganizationLocalisationSettingsById(
    @PathParam('organizationId') organizationId: number,
  ): Promise<GetOrganizationLoclisationSettingsDTO> {
    const result = await this.OrganizationService.getOrganizationLocalisation(organizationId);

    return new GetOrganizationLoclisationSettingsDTO({ body: { data: result, statusCode: 200 } });
  }
}
