import { applyToAll } from '@/utils/utilities';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { Member, MemberStatusType, MemberTypeEnum } from '@/modules/hr/models/Member';
import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { CreateOrganizationRO, ResourceRO } from '@/modules/organizations/routes/RequestObject';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { Result } from '@/utils/Result';
import { userStatus, User } from '@/modules/users/models/User';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { EmailMessage } from '@/types/types';
import { Email } from '@/utils/Email';
import { CreateOrganizationSchema } from '@/modules/organizations/schemas/OrganizationSchema';
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
import { CreateResourceSchema, UpdateResourceSchema } from '@/modules/resources/schemas/ResourceSchema';
import { Collection } from '@mikro-orm/core';
import { IResourceSettingsService } from '@/modules/resources/interfaces/IResourceSettingsService';
import { IResourceRateService } from '@/modules/resources';

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
      return Result.fail<number>(`Organization ${payload.name} already exist.`);
    }

    if (payload.parentId) {
      const org = await this.dao.getByCriteria({ id: payload.parentId });
      if (!org) {
        return Result.fail<number>('Organization parent does not exist');
      }
    }
    const fetchedUser = await this.userService.get(userId);
    if (fetchedUser.isFailure || fetchedUser.getValue() === null) {
      return Result.fail<number>(`User with id: ${userId} does not exist`);
    }
    const user = fetchedUser.getValue();

    let adminContact;
    if (payload.adminContact) {
      adminContact = await this.userService.get(payload.adminContact);
      if (adminContact.isFailure || adminContact.getValue() === null) {
        return Result.fail<number>(`User with id: ${payload.adminContact} does not exist.`);
      }
    }

    let direction;
    if (payload.direction) {
      direction = await this.userService.get(payload.direction);
      if (direction.isFailure || direction.getValue() === null) {
        return Result.fail<number>(`User with id: ${payload.direction} does not exist.`);
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
    });
    wrappedOrganization.direction = await direction.getValue();
    wrappedOrganization.admin_contact = await adminContact.getValue();

    const createdOrg = await this.create(wrappedOrganization);

    if (createdOrg.isFailure) {
      return Result.fail<number>(createdOrg.error);
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

  @log()
  @safeGuard()
  async inviteUserByEmail(email: string, orgId: number): Promise<Result<number>> {
    const existingUser = await this.keycloak
      .getAdminClient()
      .users.find({ email, realm: getConfig('keycloak.clientValidation.realmName') });
    if (existingUser.length > 0) {
      return Result.fail<number>('The user already exist.');
    }

    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail<number>('The organization to add the user to does not exist.');
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
      return Result.fail<number>(savedUser.error);
    }
    // create member for the organization
    const createdMemberResult = await this.memberService.create({
      user: savedUser.getValue(),
      organization: existingOrg,
      memberType: MemberTypeEnum.Regular,
    });

    if (createdMemberResult.isFailure) {
      return Result.fail<number>(createdMemberResult.error);
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
      return Result.fail(`user with id ${id} not exist.`);
    }
    const user = existingUser.getValue();
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail(`Organization with id ${orgId} does not exist.`);
    }

    if (!this.memberService.getByCriteria({ user: id }, FETCH_STRATEGY.SINGLE)) {
      return Result.fail(`user with id ${id} is not member in organization.`);
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
      return Result.fail(`Organization with id ${orgId} does not exist.`);
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
  ): Promise<Result<OrganizationAndResource | string>> {
    let currentOrg;
    let currentRes;
    if (organization) {
      currentOrg = await this.dao.get(organization);
      if (currentOrg === null) {
        return Result.fail(`Organization with id ${organization} does not exist.`);
      }
    }
    if (resource) {
      currentRes = await this.resourceService.get(resource);
      if (currentRes.isFailure || currentRes.getValue() === null) {
        return Result.fail(`Resource with id ${resource} does not exist.`);
      }
    }
    return Result.ok({ currentOrg, currentRes: currentRes.getValue() });
  }

  @log()
  @safeGuard()
  @validate
  public async addMemberToOrganization(
    @validateParam(CreateMemberSchema) payload: MemberRO,
  ): Promise<Result<number | string>> {
    const existence = await this.checkEntitiesExistence(payload.organization, payload.resource);
    if (existence.isFailure) {
      return Result.fail(existence.error);
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
      return Result.fail(`Organization with id ${organizationId} does not exist.`);
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
        return Result.fail<number>(`User with id ${payload.user} does not exist.`);
      }
      user = fetchedUser.getValue();
    }

    let organization: Organization = null;
    if (payload.organization) {
      const fetchedOrganization = await this.dao.get(payload.organization);
      if (!fetchedOrganization) {
        return Result.fail<number>(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization;
    }

    const managers: Member[] = [];
    if (payload.managers) {
      for await (const { organization, user } of payload.managers) {
        const fetcheManager = await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE);
        if (fetcheManager.isFailure || !fetcheManager.getValue()) {
          return Result.fail<number>(
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
    const fetchedResourceResult = await this.resourceService.get(resourceId);
    if (fetchedResourceResult.isFailure || fetchedResourceResult.getValue() === null) {
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }
    const fetchedResource: Resource = fetchedResourceResult.getValue();

    if (payload.managers) {
      const managers: Member[] = [];
      for await (const { organization, user } of payload.managers) {
        const fetcheManager = await this.memberService.getByCriteria({ organization, user }, FETCH_STRATEGY.SINGLE);
        if (fetcheManager.isFailure || !fetcheManager.getValue()) {
          return Result.fail<number>(
            `Manager with user id ${user} in organization with id ${organization} does not exist.`,
          );
        }
        managers.push(fetcheManager.getValue());
      }

      let existingManagers = fetchedResource.managers.getItems();

      for (const manager of managers) {
        if (
          existingManagers.filter(
            (eManager) => eManager.user.id === manager.user.id && eManager.organization.id === manager.organization.id,
          ).length === 0
        ) {
          fetchedResource.managers.add(manager);
          existingManagers = existingManagers.filter(
            (eManager) => eManager.user.id !== manager.user.id && eManager.organization.id !== manager.organization.id,
          );
        }
      }
      for (const manager of existingManagers) {
        fetchedResource.managers.remove(manager);
      }
    }

    if (payload.tags) {
      const existingTags = await fetchedResource.tags.init();
      for (const tag of payload.tags) {
        if (!tag.id) {
          await this.resourceTagService.create({
            title: tag.title,
            resource: fetchedResource,
          });
          existingTags.remove((eTag) => eTag.title === tag.title);
        }
      }
      for (const tag of existingTags) {
        await this.resourceTagService.remove(tag.id);
      }
    }

    const resource = this.resourceService.wrapEntity(
      fetchedResource,
      {
        ...payload,
      },
      false,
    );

    const updateResourceResult = await this.resourceService.update(resource);
    if (updateResourceResult.isFailure) {
      return Result.fail<number>(updateResourceResult.error);
    }
    const id = updateResourceResult.getValue().id;
    return Result.ok<number>(id);
  }
}
