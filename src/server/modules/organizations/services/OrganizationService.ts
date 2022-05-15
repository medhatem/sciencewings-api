import { applyToAll } from '@/utils/utilities';
import { Member } from '@/modules/hr/models/Member';
import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import {
  OrganizationAccessSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationReservationSettingsRO,
  OrganizationMemberSettingsRO,
  CreateOrganizationRO,
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
import { IOrganizationSettingsService } from '@/modules/organizations/interfaces/IOrganizationSettingsService';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { CreateOrganizationPhoneSchema } from '@/modules/phones/schemas/PhoneSchema';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { CreateOrganizationAddressSchema } from '@/modules/address/schemas/AddressSchema';
import { MemberEvent } from '@/modules/hr/events/MemberEvent';

@provideSingleton(IOrganizationService)
export class OrganizationService extends BaseService<Organization> implements IOrganizationService {
  constructor(
    public dao: OrganizationDao,
    public organizationSettingsService: IOrganizationSettingsService,
    public userService: IUserService,
    public labelService: IOrganizationLabelService,
    public addressService: IAddressService,
    public phoneService: IPhoneService,
    public emailService: Email,
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
    // check if the organization already exist
    const existingOrg = await this.dao.getByCriteria({ name: payload.name });
    if (existingOrg) {
      return Result.fail(`Organization ${payload.name} already exist.`);
    }
    let parent;
    if (payload.parentId) {
      const org = await this.dao.getByCriteria({ id: payload.parentId });
      if (!org) {
        return Result.notFound(`Organization parent with id ${payload.parentId} does not exist`);
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
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.get(payload.direction);
      if (direction.isFailure || direction.getValue() === null) {
        return Result.notFound(`User with id: ${payload.direction} does not exist.`);
      }
    }

    const wrappedOrganization = this.wrapEntity(this.dao.model, {
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
      owner: user,
      parent,
    });
    wrappedOrganization.direction = await direction.getValue();
    wrappedOrganization.admin_contact = await adminContact.getValue();

    const createdOrg = await this.create(wrappedOrganization);
    const createdSettings = await this.organizationSettingsService.create({});
    wrappedOrganization.settings = createdSettings.getValue();

    if (createdOrg.isFailure) {
      return createdOrg;
    }

    const organization = await createdOrg.getValue();

    const memberEvent = new MemberEvent();
    memberEvent.createMember(user, organization);

    await applyToAll(payload.addresses, async (address) => {
      await this.addressService.create({
        city: address.city,
        apartment: address.apartment,
        country: address.country,
        code: address.code,
        province: address.province,
        street: address.street,
        type: address.type,
        organization,
      });
    });
    await applyToAll(payload.phones, async (phone) => {
      await this.phoneService.create({
        phoneLabel: phone.phoneLabel,
        phoneCode: phone.phoneCode,
        phoneNumber: phone.phoneNumber,
        organization,
      });
    });

    if (payload.labels?.length) {
      await this.labelService.createBulkLabel(payload.labels, organization);
    }

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
    console.log({ payload });

    const fetchedorganization = await this.dao.get(orgId);
    if (!fetchedorganization) {
      return Result.notFound(`organization with id ${orgId} does not exist.`);
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.get(payload.direction);
      if (direction.isFailure || direction.getValue() === null) {
        return Result.notFound(`User with id: ${payload.direction} does not exist.`);
      }
      direction = direction.getValue();
    }

    let adminContact;
    if (payload.adminContact) {
      adminContact = await this.userService.get(payload.adminContact);
      if (adminContact.isFailure || adminContact.getValue() === null) {
        return Result.notFound(`User with id: ${payload.adminContact} does not exist.`);
      }
      adminContact = adminContact.getValue();
    }

    let parent;
    if (payload.parent) {
      parent = await this.dao.get(payload.parent);
      if (parent === null) {
        return Result.notFound(`Organization with id: ${payload.parent} does not exist.`);
      }
    }

    if (payload.phones) {
      // TODO better way to update
      const phone = await this.phoneService.get(payload.phones[0].id);
      console.log({ ...phone, ...payload.phones[0] });

      await this.phoneService.update({ ...phone, ...payload.phones[0] });
    }
    const organization = this.wrapEntity(fetchedorganization, {
      ...fetchedorganization,
      ...payload,
    });
    if (adminContact) {
      organization.admin_contact = adminContact;
    }
    if (direction) {
      organization.direction = direction.id;
    }
    if (parent) {
      organization.parent = parent;
    }
    await this.dao.update(organization);
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

  //Organization Settings Services

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
    const newSettings = this.organizationSettingsService.wrapEntity(
      oldSetting,
      {
        ...oldSetting,
        ...payload,
      },
      false,
    );

    await this.organizationSettingsService.update(newSettings);

    return Result.ok<number>(organizationId);
  }
}
