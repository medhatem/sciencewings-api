import { applyToAll } from '@/utils/utilities';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { Member, MemberStatusType, MemberTypeEnum } from '@/modules/hr/models/Member';
import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import {
  CreateOrganizationRO,
  ResourceCalendarRO,
  ResourceRO,
  UpdateOrganizationRO,
} from '@/modules/organizations/routes/RequestObject';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { Result } from '@/utils/Result';
import { userStatus, User } from '@/modules/users/models/User';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { EmailMessage } from '@/types/types';
import { Email } from '@/utils/Email';
import { CreateOrganizationSchema, UpdateOrganizationSchema } from '@/modules/organizations/schemas/OrganizationSchema';
import { getConfig } from '@/configuration/Configuration';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { IOrganizationLabelService } from '@/modules/organizations/interfaces/IOrganizationLabelService';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { FETCH_STRATEGY } from '@/modules/base';
import { CreateMemberSchema } from '@/modules/hr/schemas/MemberSchema';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import { IResourceCalendarService } from '@/modules/resources/interfaces/IResourceCalendarService';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { IResourceTagService } from '@/modules/resources/interfaces/IResourceTagService';
import { Resource } from '@/modules/resources/models/Resource';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import {
  CreateResourceSchema,
  ResourceCalendarSchema,
  UpdateResourceSchema,
} from '@/modules/resources/schemas/ResourceSchema';
import { Collection } from '@mikro-orm/core';
import { IResourceSettingsService } from '@/modules/resources/interfaces/IResourceSettingsService';
import { IResourceRateService, ResourceCalendar } from '@/modules/resources';
import { createPhoneRO } from '@/modules/phones/routes/PhoneRO';
import { CreateOrganizationPhoneSchema } from '@/modules/phones/schemas/PhoneSchema';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { CreateOrganizationAddressSchema } from '@/modules/address/schemas/AddressSchema';

type OrganizationAndResource = { currentOrg: Organization; currentRes: Resource };

@provideSingleton(IOrganizationService)
export class OrganizationService extends BaseService<Organization> implements IOrganizationService {
  constructor(
    public dao: OrganizationDao,
    public userService: IUserService,
    public labelService: IOrganizationLabelService,
    public memberService: IMemberService,
    public resourceService: IResourceService,
    public resourceSettingsService: IResourceSettingsService,
    public resourceRateService: IResourceRateService,
    public resourceCalendarService: IResourceCalendarService,
    public resourceTagService: IResourceTagService,
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
    let parent = null;
    if (payload.parentId) {
      const org = await this.dao.getByCriteria({ id: payload.parentId });
      if (!org) {
        return Result.notFound(`Organization parent id ${payload.parentId} does not exist`);
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

    if (createdOrg.isFailure) {
      return createdOrg;
    }

    const organization = await createdOrg.getValue();

    await organization.address.init();
    await organization.phones.init();
    await organization.members.init();

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
      this.labelService.createBulkLabel(payload.labels, organization);
    }

    const member = await this.memberService.create({
      name: user.firstname + ' ' + user.lastname,
      user,
      active: true,
      organization,
      memberType: MemberStatusType.ACTIVE,
    });

    if (!member.isFailure) {
      organization.members.add(member.getValue());
    }

    await this.update(organization);
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
      return Result.notFound(`organization with id ${orgId} does not exist.`);
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.get(payload.direction);
      if (direction.isFailure || direction.getValue() === null) {
        return Result.notFound(`User with id: ${payload.direction} does not exist.`);
      }
    }

    let adminContact;
    if (payload.adminContact) {
      adminContact = await this.userService.get(payload.adminContact);
      if (adminContact.isFailure || adminContact.getValue() === null) {
        return Result.notFound(`User with id: ${payload.adminContact} does not exist.`);
      }
    }

    let parent;
    if (payload.parent) {
      parent = await this.userService.get(payload.parent);
      if (parent.isFailure || parent.getValue() === null) {
        return Result.notFound(`User with id: ${payload.parent} does not exist.`);
      }
    }
    const organization = this.wrapEntity(fetchedorganization, {
      ...fetchedorganization,
      ...payload,
      direction,
      admin_contact: adminContact,
      parent,
    });

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
    @validateParam(CreateOrganizationPhoneSchema) payload: createPhoneRO,
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

    console.log(newPhone);
    if (newPhone.isFailure) {
      return Result.fail(`fail to create new phone.`);
    }

    const id = newPhone.getValue().id;
    return Result.ok<number>(id);
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

    const id = newAddress.getValue().id;
    return Result.ok<number>(id);
  }

  @log()
  @safeGuard()
  async inviteUserByEmail(email: string, orgId: number): Promise<Result<number>> {
    const existingUser = await this.keycloak
      .getAdminClient()
      .users.find({ email, realm: getConfig('keycloak.clientValidation.realmName') });
    if (existingUser.length > 0) {
      return Result.fail('The user already exist.');
    }

    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.notFound('The organization to add the user to does not exist.');
    }

    const createdKeyCloakUser = await this.keycloak.getAdminClient().users.create({
      email,
      firstName: '',
      lastName: '',
      realm: getConfig('keycloak.clientValidation.realmName'),
    });

    //save created keycloak user in the database
    const user = new User();
    user.firstname = '';
    user.lastname = '';
    user.email = email;
    user.keycloakId = createdKeyCloakUser.id;

    const savedUser = await this.userService.create(user);
    if (savedUser.isFailure) {
      return savedUser;
    }
    // create member for the organization
    const createdMemberResult = await this.memberService.create({
      user: savedUser.getValue(),
      organization: existingOrg,
      memberType: MemberTypeEnum.Regular,
    });

    if (createdMemberResult.isFailure) {
      return createdMemberResult;
    }

    existingOrg.members.add(createdMemberResult.getValue());

    await this.dao.update(existingOrg);
    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: email,
      text: 'Sciencewings - reset password',
      html: '<html><body>Reset password</body></html>',
      subject: ' reset password',
    };

    this.emailService.sendEmail(emailMessage);
    user.status = userStatus.INVITATION_PENDING;
    await this.userService.update(user);

    return Result.ok<number>(savedUser.getValue().id);
  }

  @log()
  @safeGuard()
  async resendInvite(id: number, orgId: number): Promise<Result<number>> {
    const existingUser = await this.userService.get(id);

    if (existingUser.isFailure || existingUser.getValue() === null) {
      return Result.notFound(`user with id ${id} not exist.`);
    }
    const user = existingUser.getValue();
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail(`Organization with id ${orgId} does not exist.`);
    }

    if (!this.memberService.getByCriteria({ user: id }, FETCH_STRATEGY.SINGLE)) {
      return Result.notFound(`user with id ${id} is not member in organization.`);
    }

    if (user.status !== userStatus.INVITATION_PENDING) {
      return Result.fail(`Cannot resend invite to an active user `);
    }
    const url = process.env.KEYCKLOACK_RESET_PASSWORD;
    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: user.email,
      text: 'Sciencewings - reset password',
      html: `<html><body><a href=${url}>-reset password</a></body></html>`,
      subject: 'reset password',
    };
    this.emailService.sendEmail(emailMessage);
    return Result.ok<number>(user.id);
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
   * check the required entities for creating an organization
   * @param organization
   * @param resource
   * @returns required entities
   */
  @log()
  @safeGuard()
  private async checkEntitiesExistence(
    organization: number,
    resource: number,
  ): Promise<Result<OrganizationAndResource>> {
    let currentOrg;
    let currentRes;
    if (organization) {
      currentOrg = await this.dao.get(organization);
      if (currentOrg === null) {
        return Result.notFound(`Organization with id ${organization} does not exist.`);
      }
    }
    if (resource) {
      currentRes = await this.resourceService.get(resource);
      if (currentRes.isFailure || currentRes.getValue() === null) {
        return Result.notFound(`Resource with id ${resource} does not exist.`);
      }
    }
    return Result.ok({ currentOrg, currentRes: currentRes.getValue() });
  }

  @log()
  @safeGuard()
  @validate
  public async addMemberToOrganization(
    @validateParam(CreateMemberSchema) payload: MemberRO,
  ): Promise<Result<number | OrganizationAndResource>> {
    const existence = await this.checkEntitiesExistence(payload.organization, payload.resource);
    if (existence.isFailure) {
      return existence;
    }
    const { currentOrg, currentRes } = existence.getValue() as OrganizationAndResource;

    const createdMemberResult = await this.memberService.create({
      ...payload,
      organization: currentOrg,
      resource: currentRes,
    });

    if (createdMemberResult.isFailure) {
      return createdMemberResult;
    }

    const createdMember = createdMemberResult.getValue();

    const createdWorkLocation = await this.addressService.create({
      city: payload.workLocation.city,
      apartment: payload.workLocation.apartment,
      country: payload.workLocation.country,
      code: payload.workLocation.code,
      province: payload.workLocation.province,
      street: payload.workLocation.street,
      type: payload.workLocation.type,
      member: createdMember,
    });

    createdMember.workLocation = createdWorkLocation;

    if (payload.workPhone) {
      createdMember.workPhone = await this.phoneService.create({
        phoneLabel: payload.workPhone.phoneLabel,
        phoneCode: payload.workPhone.phoneCode,
        phoneNumber: payload.workPhone.phoneNumber,
        member: createdMember,
      });
    }

    if (payload.emergencyPhone) {
      createdMember.emergencyPhone = await this.phoneService.create({
        phoneLabel: payload.emergencyPhone.phoneLabel,
        phoneCode: payload.emergencyPhone.phoneCode,
        phoneNumber: payload.emergencyPhone.phoneNumber,
        member: createdMember,
      });
    }

    await this.memberService.update(createdMember);

    return Result.ok(createdMember.getValue().id);
  }

  // Resource methods

  /**
   * retrieve all resources of a given organization by id
   *
   * @param organizationId organization id
   * @return list of the resources that match the criteria
   */
  @log()
  @safeGuard()
  public async getResourcesOfAGivenOrganizationById(organizationId: number): Promise<Result<Resource[]>> {
    if (!organizationId) {
      return Result.fail(`Organization id should be provided.`);
    }
    const fetchedOrganization = await this.dao.get(organizationId);
    if (!fetchedOrganization) {
      return Result.notFound(`Organization with id ${organizationId} does not exist.`);
    }
    const resources = await this.resourceService.getByCriteria(
      {
        organization: organizationId,
      },
      FETCH_STRATEGY.ALL,
      { refresh: true },
    );
    return Result.ok(resources.getValue());
  }

  @log()
  @safeGuard()
  @validate
  public async createResource(@validateParam(CreateResourceSchema) payload: ResourceRO): Promise<Result<number>> {
    let user: User = null;
    if (payload.user) {
      const fetchedUser = await this.userService.getUserByCriteria({ id: payload.user });
      if (fetchedUser.isFailure || !fetchedUser) {
        return Result.notFound(`User with id ${payload.user} does not exist.`);
      }
      user = fetchedUser.getValue();
    }

    let organization: Organization = null;
    if (payload.organization) {
      const fetchedOrganization = await this.dao.get(payload.organization);
      if (!fetchedOrganization) {
        return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization;
    }

    const managers: Member[] = [];
    if (payload.managers) {
      for await (const { organization, user } of payload.managers) {
        const fetcheManager = await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE);
        if (fetcheManager.isFailure || !fetcheManager.getValue()) {
          return Result.notFound(
            `Manager with user id ${user} in organization with id ${organization} does not exist.`,
          );
        }
        managers.push(fetcheManager.getValue());
      }
    }
    const resourceSetting = await this.resourceSettingsService.create({});
    if (resourceSetting.isFailure) {
      return resourceSetting;
    }

    const createdResourceResult = await this.resourceService.create({
      name: payload.name,
      description: payload.description,
      active: payload.active,
      resourceType: payload.resourceType,
      resourceClass: payload.resourceClass,
      timezone: payload.timezone,
      organization,
      user,
      settings: resourceSetting.getValue(),
    });
    if (createdResourceResult.isFailure) {
      return createdResourceResult;
    }
    const createdResource = createdResourceResult.getValue();

    await createdResource.managers.init();
    for (const manager of managers) {
      createdResource.managers.add(manager);
    }

    await applyToAll(
      payload.tags,
      async (tag) => {
        await this.resourceTagService.create({
          title: tag.title,
          resource: createdResource,
        });
      },
      true,
    );

    await this.resourceService.update(createdResource);
    await this.dao.update(organization);

    const id = createdResource.id;
    return Result.ok<number>(id);
  }

  @log()
  @safeGuard()
  @validate
  public async updateResource(
    @validateParam(UpdateResourceSchema) payload: ResourceRO,
    resourceId: number,
  ): Promise<Result<number>> {
    const fetchedResource = await this.dao.get(resourceId);
    if (!fetchedResource) {
      return Result.notFound(`Resource with id ${resourceId} does not exist.`);
    }

    let user = null;
    if (payload.user) {
      const fetchedUser = await this.userService.getUserByCriteria({ id: payload.user });
      if (fetchedUser.isFailure || !fetchedUser) {
        return Result.notFound(`User with id ${payload.user} does not exist.`);
      }
      user = fetchedUser.getValue();
    }

    let organization = null;
    if (payload.organization) {
      const fetchedOrganization = await this.dao.get(payload.organization);
      if (!fetchedOrganization) {
        return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization;
    }

    if (payload.calendar) {
      delete payload.calendar;
      const updatedResourceCalendar = await this.resourceCalendarService.update(payload.calendar);
      if (updatedResourceCalendar.isFailure) {
        return updatedResourceCalendar;
      }
      payload.calendar = updatedResourceCalendar.getValue();
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      ...payload,
    });

    const createdResource = await this.resourceService.update({ ...resource, user, organization });
    if (createdResource.isFailure) {
      return createdResource;
    }
    const id = createdResource.getValue().id;
    return Result.ok<number>(id);
  }

  @log()
  @safeGuard()
  @validate
  public async createResourceCalendar(
    @validateParam(ResourceCalendarSchema) payload: ResourceCalendarRO,
  ): Promise<Result<ResourceCalendar>> {
    let organization = null;
    if (payload.organization) {
      organization = await this.dao.get(payload.organization);
      if (!organization) {
        return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
      }
    }

    const resourceCalendar: ResourceCalendar = this.resourceCalendarService.wrapEntity(
      new ResourceCalendar(),
      {
        ...payload,
        organization,
      },
      false,
    );

    const createdResourceCalendar = await this.resourceCalendarService.create(resourceCalendar);
    return Result.ok<any>(createdResourceCalendar);
  }
}
