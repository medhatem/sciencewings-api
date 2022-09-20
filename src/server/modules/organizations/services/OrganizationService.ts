import { Member } from '@/modules/hr/models/Member';
import { container, provideSingleton, lazyInject } from '@/di/index';
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
import { log } from '@/decorators/log';
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
import { GroupEvent } from '@/modules/hr/events/GroupEvent';
import { grpPrifix, orgPrifix } from '@/modules/prifixConstants';
import { AddressType } from '@/modules/address/models/Address';
import { IOrganizationSettingsService } from '@/modules/organizations/interfaces/IOrganizationSettingsService';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { ConflictError } from '@/Exceptions/ConflictError';
import { InternalServerError, NotFoundError } from '@/Exceptions';

import { OrganizationSettings } from '@/modules/organizations/models/OrganizationSettings';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';

@provideSingleton(IOrganizationService)
export class OrganizationService extends BaseService<Organization> implements IOrganizationService {
  @lazyInject(IInfrastructureService) public infraService: IInfrastructureService;
  @lazyInject(IMemberService) public memberService: IMemberService;

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
    //this.infraService = infraService;
  }

  static getInstance(): IOrganizationService {
    return container.get(IOrganizationService);
  }
  @log()
  public async getOrganizationById(id: number): Promise<Organization> {
    const organization = await this.dao.get(id);
    return organization
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
  @validate
  public async createOrganization(
    @validateParam(CreateOrganizationSchema) payload: CreateOrganizationRO,
    userId: number,
  ): Promise<number> {
    const existingOrg = (await this.dao.getByCriteria({
      name: payload.name,
    })) as Organization;
    if (existingOrg) {
      throw new ConflictError('{{name}} ALREADY_EXISTS', { variables: { name: payload.name }, friendly: true });
    }
    let parent: Organization;
    if (payload.parent) {
      const org = (await this.dao.getByCriteria({ id: payload.parent }, FETCH_STRATEGY.SINGLE)) as Organization;
      if (!org) {
        throw new NotFoundError('ORG.NON_EXISTANT_PARENT_ORG', { friendly: true });
      }
      parent = org;
    }
    const user = await this.userService.get(userId);
    if (!user) {
      throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${userId}` } });
    }

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
    wrappedOrganization.owner = user;
    const groupName = `${orgPrifix}${payload.name}`;
    // create keycloak organization
    const keycloakOrganization = await this.keycloakUtils.createGroup(groupName);
    /**
     * create keycloak admin group as well as members group
     * and add the owner attribute to the organization in keycloak
     */
    let adminGroup;
    let membersGroup;
    let organization: Organization;
    try {
      [adminGroup, membersGroup] = await Promise.all([
        this.keycloakUtils.createGroup(`${grpPrifix}admin`, keycloakOrganization),
        this.keycloakUtils.createGroup(`${grpPrifix}members`, keycloakOrganization),
        this.keycloakUtils.addOwnerToGroup(keycloakOrganization, groupName, user.keycloakId),
      ]);
      await this.keycloakUtils.addMemberToGroup(adminGroup, user.keycloakId);

      //storing the KC groups ids
      wrappedOrganization.kcid = keycloakOrganization;
      wrappedOrganization.adminGroupkcid = adminGroup;
      wrappedOrganization.memberGroupkcid = membersGroup;
      const organizationSetting = await this.organizationSettingsService.create({});
      wrappedOrganization.settings = organizationSetting;

      organization = await this.create(wrappedOrganization);
      const memberEvent = new MemberEvent();
      await memberEvent.createMember(user, organization);

      const groupEvent = new GroupEvent();
      // create the admin and member groups in the db
      // add the owner as a member to the organization
      await Promise.all([
        groupEvent.createGroup(adminGroup, organization, `${grpPrifix}admin`),
        groupEvent.createGroup(membersGroup, organization, `${grpPrifix}member`),
      ]);
    } catch (error) {
      await Promise.all<any>(
        [
          keycloakOrganization && this.keycloakUtils.deleteGroup(keycloakOrganization),
          organization && this.remove(organization.id),
        ].filter(Boolean),
      );
      throw new InternalServerError('SOMETHING_WENT_WRONG');
    }

    if (payload.labels?.length) {
      await this.labelService.createBulkLabel(payload.labels, organization);
    }

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
    //create a default infastructure

    const responsable = (await this.memberService.getByCriteria(
      { user, organization },
      FETCH_STRATEGY.SINGLE,
    )) as Member;

    const defaultInfrastructure = this.infraService.wrapEntity(Infrastructure.getInstance(), {
      name: `${organization.name}_defaultInfra`,
      key: `${organization.name}_defaultInfra`,
      default: true,
    });
    defaultInfrastructure.responsible = responsable;
    defaultInfrastructure.organization = organization;
    await this.infraService.create(defaultInfrastructure);
    return organization.id;
  }

  /**
   * Udate General(unit) properties of organization like name description
   * @param payload Update Organization properties details
   * @param orgId organization id
   */
  @log()
  @validate
  public async updateOrganizationGeneraleProperties(
    @validateParam(UpdateOrganizationSchema) payload: UpdateOrganizationRO,
    orgId: number,
  ): Promise<number> {
    const fetchedorganization = await this.dao.get(orgId);
    if (!fetchedorganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` }, friendly: false });
    }

    if (fetchedorganization.name !== payload.name) {
      //update the Kc group name
      await this.keycloakUtils.updateGroup(fetchedorganization.kcid, {
        name: `${orgPrifix}${payload.name}`,
      });
    }

    const wrappedOrganization = this.wrapEntity(fetchedorganization, {
      ...payload,
    });

    if (payload.owner) {
      const owner = await this.userService.get(payload.owner);
      if (!owner) {
        throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', {
          variables: { user: `${payload.owner}` },
          friendly: false,
        });
      }
      wrappedOrganization.owner = owner;
    }

    if (payload.parent) {
      const parent = await this.dao.get(payload.parent);
      if (!parent) {
        throw new NotFoundError('ORG.NON_EXISTANT_PARENT_ORG');
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
      }
    }
    return orgId;
  }

  /**
   * add new phone to organization
   * @param payload create phone details
   * @param orgId organization id
   */
  @log()
  @validate
  public async addPhoneToOrganization(
    @validateParam(CreateOrganizationPhoneSchema) payload: PhoneRO,
    orgId: number,
  ): Promise<number> {
    const fetchedorganization = await this.dao.get(orgId);
    if (!fetchedorganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` }, friendly: false });
    }
    const newPhone = await this.phoneService.create({
      phoneLabel: payload.phoneLabel,
      phoneCode: payload.phoneCode,
      phoneNumber: payload.phoneNumber,
      Organization: fetchedorganization,
    });

    return newPhone.id;
  }

  /**
   * add new address to organization
   * @param payload create address details
   * @param orgId organization id
   */
  @log()
  @validate
  public async addAddressToOrganization(
    @validateParam(CreateOrganizationAddressSchema) payload: AddressRO,
    orgId: number,
  ): Promise<number> {
    const fetchedorganization = await this.dao.get(orgId);
    if (!fetchedorganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` }, friendly: false });
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

    return newAddress.id;
  }

  @log()
  public async getMembers(orgId: number, statusFilter?: string): Promise<Member[]> {
    const existingOrg = await this.dao.get(orgId);
    if (!existingOrg) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` }, friendly: false });
    }

    if (!statusFilter) {
      if (!existingOrg.members.isInitialized()) await existingOrg.members.init();
      return existingOrg.members.toArray().map((el: any) => ({ ...el }));
    } else {
      const status = statusFilter.split(',');
      const members = await existingOrg.members.init({ where: { membership: status as any } as any });
      return members.toArray().map((member: any) => ({ ...member }));
    }
  }

  /**
   * Delete organization
   * @param organizationId organization id
   */
  @log()
  public async deleteOrganization(organizationId: number): Promise<number> {
    const fetchedorganization = await this.dao.get(organizationId);
    if (!fetchedorganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${organizationId}` },
        friendly: false,
      });
    }
    const group = await this.keycloakUtils.getGroupById(fetchedorganization.kcid);

    //check if the org have subgroups
    if (group.subGroups.length !== 0) {
      throw new InternalServerError('KEYCLOAK.GROUP_DELETION_SUB_GROUP', { friendly: false });
    }

    await this.keycloakUtils.deleteGroup(fetchedorganization.kcid);

    await this.dao.remove(fetchedorganization);
    return organizationId;
  }
  /* Get all the settings of an organization ,
   *
   * @param id of the requested organization
   *
   */
  @log()
  public async getOrganizationSettingsById(organizationId: number): Promise<OrganizationSettings> {
    const fetchedOrganization = await this.get(organizationId, { populate: ['settings'] as any });

    if (!fetchedOrganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${organizationId}` },
        friendly: false,
      });
    }
    return fetchedOrganization.settings;
  }

  /* Update the reservation, invoices or access settings of an organization ,
   *
   * @param payload
   * @param id of the requested organization
   *
   */
  @log()
  public async updateOrganizationsSettingsProperties(
    payload:
      | OrganizationMemberSettingsRO
      | OrganizationReservationSettingsRO
      | OrganizationInvoicesSettingsRO
      | OrganizationAccessSettingsRO,
    organizationId: number,
  ): Promise<number> {
    const fetchedOrganization = await this.get(organizationId);
    if (!fetchedOrganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${organizationId}` },
        friendly: false,
      });
    }
    const oldSetting = fetchedOrganization.settings;
    const newSettings = this.organizationSettingsService.wrapEntity(oldSetting, {
      ...oldSetting,
      ...payload,
    });

    await this.organizationSettingsService.update(newSettings);

    return organizationId;
  }
}
