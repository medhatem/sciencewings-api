import { applyToAll } from '@/utils/utilities';
import { Member } from '@/modules/hr/models/Member';
import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import {
  CreateOrganizationRO,
  OrganizationAccessSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationMemberSettingsRO,
  OrganizationReservationSettingsRO,
  UpdateOrganizationRO,
} from '@/modules/organizations/routes/RequestObject';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { Email } from '@/utils/Email';
import { CreateOrganizationSchema, UpdateOrganizationSchema } from '@/modules/organizations/schemas/OrganizationSchema';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { IOrganizationLabelService } from '@/modules/organizations/interfaces/IOrganizationLabelService';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { FETCH_STRATEGY } from '@/modules/base';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { Collection } from '@mikro-orm/core';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { CreateOrganizationPhoneSchema } from '@/modules/phones/schemas/PhoneSchema';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { CreateOrganizationAddressSchema } from '@/modules/address/schemas/AddressSchema';
import { Keycloak } from '@/sdks/keycloak';
import { MemberEvent } from '@/modules/hr/events/MemberEvent';
import { getConfig } from '@/configuration/Configuration';
import { GroupEvent } from '@/modules/hr/events/GroupEvent';
import { catchKeycloackError } from '@/utils/keycloack';
import { AddressType } from '@/modules/address/models/Address';
import { OrganizationSettingsService } from '@/modules/organizations/services/OrganizationSettingsService';

@provideSingleton(IOrganizationService)
export class OrganizationService extends BaseService<Organization> implements IOrganizationService {
  constructor(
    public dao: OrganizationDao,
    public organizationSettingsService: OrganizationSettingsService,
    public userService: IUserService,
    public labelService: IOrganizationLabelService,
    public addressService: IAddressService,
    public phoneService: IPhoneService,
    public emailService: Email,
    public keycloak: Keycloak,
  ) {
    super(dao);
  }

  static getInstance(): IOrganizationService {
    return container.get(IOrganizationService);
  }

  // Oranization methods

  @log()
  @safeGuard()
  @validate
  public async createOrganization(
    @validateParam(CreateOrganizationSchema) payload: CreateOrganizationRO,
    userId: number,
  ): Promise<Result<number>> {
    const existingOrg = await this.dao.getByCriteria({ name: payload.name });
    if (existingOrg) {
      return Result.fail(`Organization ${payload.name} already exist.`);
    }
    let parent: Organization;
    if (payload.parent) {
      const org = (await this.dao.getByCriteria({ id: payload.parent }, FETCH_STRATEGY.SINGLE)) as Organization;
      if (!org) {
        return Result.notFound(`Organization parent with id ${payload.parent} does not exist`);
      }
      parent = org;
    }
    const fetchedUser = await this.userService.get(userId);

    if (fetchedUser.isFailure || fetchedUser.getValue() === null) {
      return Result.notFound(`User with id: ${userId} does not exist`);
    }
    const user = fetchedUser.getValue();

    let adminContact;
    if (payload.adminContact) {
      adminContact = await this.userService.get(payload.adminContact);
      if (adminContact.isFailure || adminContact.getValue() === null) {
        return Result.notFound(`User with id: ${payload.adminContact} does not exist.`);
      }
      adminContact = adminContact.getValue();
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.get(payload.direction);
      if (direction.isFailure || direction.getValue() === null) {
        return Result.notFound(`User with id: ${payload.direction} does not exist.`);
      }
      direction = direction.getValue();
    }

    const wrappedOrganization = this.wrapEntity(new Organization(), {
      name: payload.name,
      description: payload.description,
      email: payload.email,
      type: payload.type,
      socialFacebook: payload.socialFacebook || null,
      socialInstagram: payload.socialInstagram || null,
      socialYoutube: payload.socialYoutube || null,
      socialGithub: payload.socialGithub || null,
      socialTwitter: payload.socialTwitter || null,
      socialLinkedin: payload.socialLinkedin || null,
    });
    wrappedOrganization.parent = parent;

    wrappedOrganization.direction = direction;
    wrappedOrganization.admin_contact = adminContact;

    let kcGroupId = null;
    try {
      let keycloakGroup = null;
      if (payload.parent) {
        keycloakGroup = await this.keycloak.getAdminClient().groups.setOrCreateChild(
          { id: parent.kcid, realm: getConfig('keycloak.clientValidation.realmName') },
          {
            name: payload.name,
          },
        );
      } else {
        keycloakGroup = await this.keycloak.getAdminClient().groups.create({
          name: payload.name,
          realm: getConfig('keycloak.clientValidation.realmName'),
        });
      }
      const { id } = await this.keycloak.getAdminClient().groups.setOrCreateChild(
        { id: keycloakGroup.id, realm: getConfig('keycloak.clientValidation.realmName') },
        {
          name: 'admin',
        },
      );
      kcGroupId = id;
      wrappedOrganization.kcid = keycloakGroup.id;
    } catch (error) {
      return catchKeycloackError(error, payload.name);
    }

    const createdOrg = await this.create(wrappedOrganization);

    if (createdOrg.isFailure) {
      return createdOrg;
    }

    const organization = await createdOrg.getValue();

    const memberEvent = new MemberEvent();
    memberEvent.createMember(user, organization);
    const groupEvent = new GroupEvent();
    groupEvent.createGroup(kcGroupId, organization, 'admin');

    await this.keycloak.getAdminClient().users.addToGroup({
      id: user.keycloakId,
      groupId: kcGroupId,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });
    await applyToAll(payload.addresses, async (address) => {
      await this.addressService.create({
        city: address.city,
        apartment: address.apartment,
        country: address.country,
        code: address.code,
        province: address.province,
        street: address.street,
        type: AddressType.ORGANIZATION,
        organization,
      });
    });

    await applyToAll(payload.phones, async (phone) => {
      await this.addressService.create({
        phoneLabel: phone.phoneLabel,
        phoneCode: phone.phoneCode,
        phoneNumber: phone.phoneNumber,
        organization,
      });
    });

    if (payload.labels?.length) {
      await this.labelService.createBulkLabel(payload.labels, organization);
    }
    this.dao.repository.flush();
    return Result.ok<number>(organization.id);
  }

  /**
   * Udate General(unit) properties of organization like name description
   * @param payload Update Organization properties details
   * @param orgId organization id
   */
  @log()
  @safeGuard()
  @validate
  public async updateOrganizationGeneraleProperties(
    @validateParam(UpdateOrganizationSchema) payload: UpdateOrganizationRO,
    orgId: number,
  ): Promise<Result<number>> {
    const fetchedorganization = await this.dao.get(orgId);
    if (!fetchedorganization) {
      return Result.notFound(`Organization with id ${orgId} does not exist.`);
    }

    if (fetchedorganization.name !== payload.name) {
      try {
        await this.keycloak.getAdminClient().groups.update(
          { id: fetchedorganization.kcid, realm: getConfig('keycloak.clientValidation.realmName') },
          {
            name: payload.name,
          },
        );
      } catch (error) {
        return catchKeycloackError(error, payload.name);
      }
    }

    const wrappedOrganization = this.wrapEntity(fetchedorganization, {
      ...payload,
    });

    if (payload.direction) {
      const direction = await this.userService.get(payload.direction);
      if (direction.isFailure || direction.getValue() === null) {
        return Result.notFound(`User with id: ${payload.direction} does not exist.`);
      }
      wrappedOrganization.direction = direction;
    }

    if (payload.adminContact) {
      const adminContact = await this.userService.get(payload.adminContact);
      if (adminContact.isFailure || adminContact.getValue() === null) {
        return Result.notFound(`User with id: ${payload.adminContact} does not exist.`);
      }
      wrappedOrganization.admin_contact = adminContact;
    }

    if (payload.parent) {
      const parent = await this.dao.get(payload.parent);
      if (!parent) {
        return Result.notFound(`Organization parent with id: ${payload.parent} does not exist.`);
      }
      wrappedOrganization.parent = parent;
    }

    await this.dao.update(wrappedOrganization);
    return Result.ok<number>(orgId);
  }

  /**
   * add new phone to organization
   * @param payload create phone details
   * @param orgId organization id
   */
  @log()
  @safeGuard()
  @validate
  public async addPhoneToOrganization(
    @validateParam(CreateOrganizationPhoneSchema) payload: PhoneRO,
    orgId: number,
  ): Promise<Result<number>> {
    const fetchedorganization = await this.dao.get(orgId);
    if (!fetchedorganization) {
      return Result.notFound(`organization with id ${orgId} does not exist.`);
    }
    const newPhone = await this.phoneService.create({
      phoneLabel: payload.phoneLabel,
      phoneCode: payload.phoneCode,
      phoneNumber: payload.phoneNumber,
      Organization: fetchedorganization,
    });

    if (newPhone.isFailure) {
      return Result.fail(`fail to create new phone.`);
    }
    return Result.ok<number>(newPhone.getValue().id);
  }

  /**
   * add new address to organization
   * @param payload create address details
   * @param orgId organization id
   */
  @log()
  @safeGuard()
  @validate
  public async addAddressToOrganization(
    @validateParam(CreateOrganizationAddressSchema) payload: AddressRO,
    orgId: number,
  ): Promise<Result<number>> {
    const fetchedorganization = await this.dao.get(orgId);
    if (!fetchedorganization) {
      return Result.notFound(`organization with id ${orgId} does not exist.`);
    }
    const newAddress = await this.addressService.create({
      country: payload.country,
      province: payload.province,
      code: payload.code,
      type: payload.type,
      city: payload.city,
      street: payload.street,
      apartment: payload.apartment,
      organization: fetchedorganization,
    });
    if (newAddress.isFailure) {
      return Result.fail(`fail to create address`);
    }
    return Result.ok<number>(newAddress.getValue().id);
  }

  @log()
  @safeGuard()
  public async getMembers(orgId: number): Promise<Result<Collection<Member>>> {
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.notFound(`Organization with id ${orgId} does not exist.`);
    }

    return Result.ok<any>(existingOrg.members);
  }

  @log()
  @safeGuard()
  public async getUserOrganizations(userId: number): Promise<Result<Organization[]>> {
    const organizations: Organization[] = (await this.dao.getByCriteria(
      { owner: userId },
      FETCH_STRATEGY.ALL,
    )) as Organization[];
    return Result.ok<Organization[]>(organizations);
  }

  /**
   * Delete organization
   * @param organizationId organization id
   */
  @log()
  @safeGuard()
  public async deleteOrganization(organizationId: number): Promise<Result<number>> {
    const fetchedorganization = await this.dao.get(organizationId);
    if (!fetchedorganization) {
      return Result.notFound(`Organization with id ${organizationId} does not exist.`);
    }
    try {
      const groups = await this.keycloak
        .getAdminClient()
        .groups.findOne({ id: fetchedorganization.kcid, realm: getConfig('keycloak.clientValidation.realmName') });

      console.log(fetchedorganization.kcid, { subGroups: groups.subGroups });

      if (groups.subGroups.length !== 1) {
        return Result.fail(`This Organization has sub groups that need to be deleted first !`);
      }

      await this.keycloak.getAdminClient().groups.del({
        id: fetchedorganization.kcid,
        realm: getConfig('keycloak.clientValidation.realmName'),
      });
    } catch (error) {
      return catchKeycloackError(error, fetchedorganization.name);
    }
    await this.dao.remove(fetchedorganization);
    return Result.ok<number>(organizationId);
  }
  /* Get all the settings of an organization ,
   *
   * @param id of the requested organization
   *
   */
  @log()
  @safeGuard()
  public async getOrganizationSettingsById(organizationId: number): Promise<Result<any>> {
    const fetchedOrganization = await this.get(organizationId);

    if (fetchedOrganization.isFailure || !fetchedOrganization.getValue()) {
      return Result.notFound(`Organization with id ${organizationId} does not exist.`);
    }
    const fetchedOrganizationValue = fetchedOrganization.getValue();
    const organization = {
      name: fetchedOrganizationValue.name,
      description: fetchedOrganizationValue.description,
      phones: fetchedOrganizationValue.phones,
      email: fetchedOrganizationValue.email,
      type: fetchedOrganizationValue.type,
      direction: fetchedOrganizationValue.direction,
      note: fetchedOrganizationValue.note,
    } as any;

    if (fetchedOrganizationValue.phone) {
      organization.phone = fetchedOrganizationValue.phone[0];
    }

    return Result.ok({
      organization,
      settings: fetchedOrganizationValue.settings,
    });
  }

  /* Update the reservation, invoices or access settings of an organization ,
   *
   * @param payload
   * @param id of the requested organization
   *
   */
  @log()
  @safeGuard()
  public async updateOrganizationsSettingsProperties(
    payload:
      | OrganizationMemberSettingsRO
      | OrganizationReservationSettingsRO
      | OrganizationInvoicesSettingsRO
      | OrganizationAccessSettingsRO,
    organizationId: number,
  ): Promise<Result<number>> {
    const fetchedOrganization = await this.get(organizationId);
    if (fetchedOrganization.isFailure || !fetchedOrganization.getValue()) {
      return Result.notFound(`Organization with id ${organizationId} does not exist.`);
    }
    const organizationValue = fetchedOrganization.getValue();
    const oldSetting = organizationValue.settings;
    const newSettings = this.organizationSettingsService.wrapEntity(oldSetting, {
      ...oldSetting,
      ...payload,
    });

    await this.organizationSettingsService.update(newSettings);

    return Result.ok<number>(organizationId);
  }
}
