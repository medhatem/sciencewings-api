import { applyToAll } from '@/utils/utilities';
import { Member } from '@/modules/hr/models/Member';
import { IMemberService } from '@/modules/hr/interfaces';
import { MemberStatusType } from '@/modules/hr/models/Member';
import { container, provide } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { Collection } from '@mikro-orm/core';
import { CreateOrganizationRO } from '@/modules/organizations/routes/RequestObject';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { Organization } from '@/modules/organizations/models/Organization';
import { OrganizationDao } from '@/modules/organizations/daos/OrganizationDao';
import { Result } from '@/utils/Result';
import { User } from '@/modules/users/models/User';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { EmailMessage } from '@/types/types';
import { Email } from '@/utils/Email';
import createSchema from '@/modules/organizations/schemas/createOrganizationSchema';
import { getConfig } from '@/configuration/Configuration';
import { IUserService } from '@/modules/users/interfaces';
import { IOrganizationLabelService } from '@/modules/organizations/interfaces/IOrganizationLabelService';
import { validateParam } from '@/decorators/validateParam';
import { validate } from '@/decorators/validate';
import { IAddressService } from '@/modules/address';
import { FETCH_STRATEGY } from '@/modules/base';
import { CreateMemberSchema } from '@/modules/hr/schemas/MemberSchema';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import {
  IResourceCalendarService,
  IResourceService,
  IResourceTagService,
  Resource,
  ResourceCalendar,
} from '@/modules/resources';
import { IPhoneService } from '@/modules/phones';
import { CreateResourceSchema, UpdateResourceSchema } from '@/modules/resources/schemas/ResourceSchema';
import { ResourceRO } from '@/modules/resources/routes/RequestObject';

type OrganizationAndResource = { currentOrg: Organization; currentRes: Resource };
@provide(IOrganizationService)
export class OrganizationService extends BaseService<Organization> implements IOrganizationService {
  constructor(
    public dao: OrganizationDao,
    public userService: IUserService,
    public labelService: IOrganizationLabelService,
    public memberService: IMemberService,
    public resourceService: IResourceService,
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
    @validateParam(createSchema) payload: CreateOrganizationRO,
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
      return Result.fail<number>(`User with id: ${userId} parent does not exist`);
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
      email: payload.email,
      type: payload.type,
      socialFacebook: payload.socialFacebook,
      socialInstagram: payload.socialInstagram,
      socialYoutube: payload.socialYoutube,
      socialGithub: payload.socialGithub,
      socialTwitter: payload.socialTwitter,
      socialLinkedin: payload.socialLinkedin,
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
    const createdMemberResult = await this.memberService.create(
      this.memberService.wrapEntity(
        new Member(),
        {
          user: savedUser,
          organization: existingOrg,
        },
        false,
      ),
    );
    if (createdMemberResult.isFailure) {
      return Result.fail<number>(createdMemberResult.error);
    }

    // add the invited user to the organization
    await existingOrg.members.init();
    existingOrg.members.add(createdMemberResult.getValue());

    await this.userService.update(savedUser.getValue());

    const emailMessage: EmailMessage = {
      from: this.emailService.from,
      to: email,
      text: 'Sciencewings - reset password',
      html: '<html><body>Reset password</body></html>',
      subject: ' reset password',
    };

    this.emailService.sendEmail(emailMessage);

    return Result.ok<number>(savedUser.getValue().id);
  }

  @log()
  @safeGuard()
  public async getMembers(orgId: number): Promise<Result<Collection<Member>>> {
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.fail(`Organization with id ${orgId} does not exist.`);
    }

    const members: Collection<Member> = await existingOrg.members.init();
    return Result.ok<Collection<Member>>(members);
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
    const resources = (await this.resourceService.getByCriteria({ organization: organizationId })) as Resource[];
    return Result.ok(resources);
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

    const managers = [];
    if (payload.managers) {
      for (const manager of payload.managers) {
        console.log({ manager });

        try {
          const fetcheManager = await this.memberService.get(manager);
          if (fetcheManager.isFailure || !fetcheManager.getValue()) {
            return Result.fail<number>(`Manager with id ${manager} does not exist.`);
          }
          managers.push(fetcheManager.getValue());
        } catch (error) {
          console.log({ error });
        }
      }
    }

    console.log('----------------wrapEntity-----------------');
    const resource = this.resourceService.wrapEntity(
      new Resource(),
      {
        name: payload.name,
        description: payload.description,
        active: payload.active,
        resourceType: payload.resourceType,
        timezone: payload.timezone,
      },
      false,
    );

    resource.organization = organization;
    resource.user = user;

    console.log({ resource });

    const createResourceCalendar = await this.resourceCalendarService.createResourceCalendar(payload.calendar);
    if (createResourceCalendar.isFailure) {
      return Result.fail<number>(createResourceCalendar.error);
    }
    resource.calendar = createResourceCalendar.getValue() as ResourceCalendar;

    resource.user = user;

    console.log({ resource });

    const createdResource = await this.create(resource);
    if (createdResource.isFailure) {
      return Result.fail<number>(createdResource.error);
    }

    console.log({ managers: resource.managers });

    resource.managers = await resource.managers.init();
    for (const manager of managers) {
      resource.managers.add(manager);
    }

    await applyToAll(payload.tags, async (tag) => {
      await this.resourceTagService.create({
        title: tag.title,
        resource: createdResource.getValue(),
      });
    });

    const id = createdResource.getValue().id;
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
      return Result.fail<number>(`Resource with id ${resourceId} does not exist.`);
    }

    let user = null;
    if (payload.user) {
      const fetchedUser = await this.userService.getUserByCriteria({ id: payload.user });
      if (fetchedUser.isFailure || !fetchedUser) {
        return Result.fail<number>(`User with id ${payload.user} does not exist.`);
      }
      user = fetchedUser.getValue();
    }

    let organization = null;
    if (payload.organization) {
      const fetchedOrganization = await this.dao.get(payload.organization);
      if (!fetchedOrganization) {
        return Result.fail<number>(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization;
    }

    if (payload.calendar) {
      delete payload.calendar;
      const updatedResourceCalendar = await this.resourceCalendarService.update(payload.calendar);
      if (updatedResourceCalendar.isFailure) {
        return Result.fail<number>(updatedResourceCalendar.error);
      }
      payload.calendar = updatedResourceCalendar.getValue();
    }

    const resource = this.wrapEntity(fetchedResource, {
      ...fetchedResource,
      ...payload,
    });

    const createdResource = await this.resourceService.create({ ...resource, user, organization });
    if (createdResource.isFailure) {
      return Result.fail<number>(createdResource.error);
    }
    const id = createdResource.getValue().id;
    return Result.ok<number>(id);
  }
}
