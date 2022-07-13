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
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { PhoneRO } from '@/modules/phones/routes/PhoneRO';
import { CreateOrganizationPhoneSchema } from '@/modules/phones/schemas/PhoneSchema';
import { AddressRO } from '@/modules/address/routes/AddressRO';
import { CreateOrganizationAddressSchema } from '@/modules/address/schemas/AddressSchema';
import { Keycloak } from '@/sdks/keycloak';
import { MemberEvent } from '@/modules/hr/events/MemberEvent';
import { getConfig } from '@/configuration/Configuration';
import { GroupEvent } from '@/modules/hr/events/GroupEvent';
import { catchKeycloackError } from '@/utils/keycloack';
import { grpPrifix, orgPrifix } from '@/modules/prifixConstants';
import { AddressType } from '@/modules/address/models/Address';
import { IOrganizationSettingsService } from '@/modules/organizations/interfaces/IOrganizationSettingsService';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';

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
    public keycloak: Keycloak,
    public keycloakUtils: KeycloakUtil,
  ) {
    super(dao);
  }

  static getInstance(): IOrganizationService {
    return container.get(IOrganizationService);
  }

  /**
   * create a new organization in multiple steps
   * step1: create the organization as a group in keycloak
   * step2: create the admin group and members group under the organization group in keycloak
   * step3: add the owner attribute to the organization group in keycloak
   * step4: create the organization in the database
   * step5: add the owner as a member of the created organization
   * step6: create the admin and member groups of the organization in the database
   * step6: persist addresses and phones and labels
   *
   * if any of the steps fail rollback all creations on keyclaok and database
   *
   *
   * @param payload represents the organization information to persist
   * @param userId id of the organization owner
   */
  @log()
  @safeGuard()
  @validate
  public async createOrganization(
    @validateParam(CreateOrganizationSchema) payload: CreateOrganizationRO,
    userId: number,
  ): Promise<Result<number>> {
    const existingOrg = (await this.dao.getByCriteria({
      $or: [{ name: payload.name }, { email: payload.email }],
    })) as Organization;
    if (existingOrg) {
      if (existingOrg.email === payload.email) {
        return Result.fail(`email ${payload.email} is already in use.`);
      }
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
    const wrappedOrganization = this.wrapEntity(new Organization(), {
      name: payload.name,
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

    wrappedOrganization.direction = user;

    const groupName = `${orgPrifix}${payload.name}`;
    // create keycloak organization
    const keycloakOrganization = await this.keycloakUtils.createGroup(groupName);
    if (keycloakOrganization.isFailure) {
      return keycloakOrganization.bubble
        ? Result.fail(keycloakOrganization.error.message)
        : Result.fail('Could not create organization.');
    }
    /**
     * create keycloak admin group as well as members group
     * and add the owner attribute to the organization in keycloak
     */
    const [adminGroup, membersGroup, ownership] = await Promise.all([
      this.keycloakUtils.createGroup(`${grpPrifix}admin`, keycloakOrganization.getValue()),
      this.keycloakUtils.createGroup(`${grpPrifix}members`, keycloakOrganization.getValue()),
      this.keycloakUtils.addOwnerToGroup(keycloakOrganization.getValue(), groupName, user.keycloakId),
    ]);
    if (adminGroup.isFailure || membersGroup.isFailure || ownership.isFailure) {
      await this.keycloakUtils.deleteGroup(keycloakOrganization.getValue());
      return Result.fail('Organization could not be created');
    }
    const addeddMember = await this.keycloakUtils.addMemberToGroup(adminGroup.getValue(), user.keycloakId);
    if (addeddMember.isFailure) {
      await this.keycloakUtils.deleteGroup(keycloakOrganization.getValue());
      return Result.fail('Organization could not be created');
    }
    //storing the KC groups ids
    wrappedOrganization.kcid = keycloakOrganization.getValue();
    wrappedOrganization.adminGroupkcid = adminGroup.getValue();
    wrappedOrganization.memberGroupkcid = membersGroup.getValue();

    const createdOrg = await this.create(wrappedOrganization);
    if (createdOrg.isFailure) {
      //revert the keycloak created organization as well
      await this.keycloakUtils.deleteGroup(keycloakOrganization.getValue());
      return Result.fail('Organization could not be created');
    }
    const organization = await createdOrg.getValue();

    const memberEvent = new MemberEvent();
    const memberOwnerResult = await memberEvent.createMember(user, organization);
    if (memberOwnerResult.isFailure) {
      // rollback created organization
      await Promise.all([this.keycloakUtils.deleteGroup(keycloakOrganization.getValue()), this.remove(organization)]);
      return Result.fail('Organization could not be created');
    }
    const groupEvent = new GroupEvent();
    // create the admin and member groups in the db
    // add the owner as a member to the organization
    const [adminGroupResult, memberGroupResult] = await Promise.all([
      groupEvent.createGroup(adminGroup.getValue(), organization, `${grpPrifix}admin`),
      groupEvent.createGroup(membersGroup.getValue(), organization, `${grpPrifix}member`),
    ]);

    if (adminGroupResult.isFailure || memberGroupResult.isFailure) {
      if (adminGroupResult.isFailure && !memberGroupResult.isFailure) {
        await groupEvent.removeGroup(memberGroupResult.getValue().id); // rollback member group
      } else if (!adminGroupResult.isFailure && memberGroupResult.isFailure) {
        await groupEvent.removeGroup(adminGroupResult.getValue().id); //rollback admin group
      }
      // rollback all the rest
      await memberEvent.deleteMember({
        user: memberOwnerResult.getValue().user,
        organization: memberOwnerResult.getValue().organization,
      });
      await Promise.all([
        this.keycloakUtils.deleteGroup(keycloakOrganization.getValue()),
        this.remove(organization.id),
      ]);
      return Result.fail('Organization could not be created');
    }

    // TODO: to be removed since the member model is in a one on one relation with organization
    // update also the organizaion model by removing the many to many relation with members
    organization.members.add(memberOwnerResult.getValue());
    this.update(organization);

    await Promise.all(
      payload.addresses.map((address) =>
        this.addressService.create({
          city: address.city,
          apartment: address.apartment,
          country: address.country,
          code: address.code,
          province: address.province,
          street: address.street,
          type: AddressType.ORGANIZATION,
          organization,
        }),
      ),
    );

    await Promise.all(
      payload.phones.map((phone) => {
        this.phoneService.create({
          phoneLabel: phone.phoneLabel,
          phoneCode: phone.phoneCode,
          phoneNumber: phone.phoneNumber,
          organization,
        });
      }),
    );

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
    const fetchedorganization = await this.dao.get(orgId);
    if (!fetchedorganization) {
      return Result.notFound(`Organization with id ${orgId} does not exist.`);
    }

    if (fetchedorganization.name !== payload.name) {
      //update the Kc group name
      const updatedOrg = await this.keycloakUtils.updateGroup(fetchedorganization.kcid, {
        name: `${orgPrifix}${payload.name}`,
      });
      if (updatedOrg.isFailure) {
        return Result.fail('Organization name could not be updated');
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

    if (payload.parent) {
      const parent = await this.dao.get(payload.parent);
      if (!parent) {
        return Result.notFound(`Organization parent with id: ${payload.parent} does not exist.`);
      }
      wrappedOrganization.parent = parent;
    }

    const updateResult = await this.dao.update(wrappedOrganization);
    if (!updateResult) {
      //in case we update the name of the org
      if (fetchedorganization.name !== payload.name) {
        //rolback the keyclock updated group name
        await this.keycloakUtils.updateGroup(fetchedorganization.kcid, {
          name: `${orgPrifix}${fetchedorganization.name}`,
        });
        return Result.fail('Organization name could not be updated ');
      }
      return Result.fail('Organization could not be updated');
    }
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
  public async getMembers(orgId: number): Promise<Result<Member[]>> {
    const existingOrg = await this.dao.get(orgId);

    if (!existingOrg) {
      return Result.notFound(`Organization with id ${orgId} does not exist.`);
    }

    if (!existingOrg.members.isInitialized()) await existingOrg.members.init();

    const members = existingOrg.members.toArray().map((el: any) => ({ ...el, joinDate: el.joinDate.toISOString() }));
    return Result.ok<any>(members);
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
      const groups = await (
        await this.keycloak.getAdminClient()
      ).groups.findOne({
        id: fetchedorganization.kcid,
        realm: getConfig('keycloak.clientValidation.realmName'),
      });

      if (groups.subGroups.length !== 1) {
        return Result.fail(`This Organization has sub groups that need to be deleted first !`);
      }

      await (
        await this.keycloak.getAdminClient()
      ).groups.del({
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

    return Result.ok({
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
