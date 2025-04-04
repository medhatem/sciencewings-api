import { Member, MembershipStatus, MemberTypeEnum } from '@/modules/hr/models/Member';
import { container, provideSingleton, lazyInject } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import {
  CreateOrganizationRO,
  OrganizationAccessSettingsRO,
  OrganizationInvoicesSettingsRO,
  OrganizationlocalisationSettingsRO,
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
import { grpPrifix, orgPrifix } from '@/modules/prifixConstants';
import { AddressType } from '@/modules/address/models/Address';
import { IOrganizationSettingsService } from '@/modules/organizations/interfaces/IOrganizationSettingsService';
import { KeycloakUtil } from '@/sdks/keycloak/KeycloakUtils';
import { ConflictError } from '@/Exceptions/ConflictError';
import { InternalServerError, NotFoundError } from '@/Exceptions';
import { AccountNumberVisibilty, OrganizationSettings } from '@/modules/organizations/models/OrganizationSettings';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { userStatus } from '@/modules/users/models/User';
import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { paginate } from '@/utils/utilities';
import { MembersList } from '@/types/types';
import { Permission } from '@/modules/permissions/models/permission';
import { IPermissionService } from '@/modules/permissions/interfaces/IPermissionService';
import { localisationSettingsType } from '@/modules/organizations/organizationtypes';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

@provideSingleton(IOrganizationService)
export class OrganizationService extends BaseService<Organization> implements IOrganizationService {
  @lazyInject(IInfrastructureService) public infraService: IInfrastructureService;
  @lazyInject(IMemberService) public memberService: IMemberService;
  @lazyInject(IGroupService) public groupService: IGroupService;

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
    public permissionService: IPermissionService,
  ) {
    super(dao);
    //this.infraService = infraService;
  }

  static getInstance(): IOrganizationService {
    return container.get(IOrganizationService);
  }
  /**
   * Get one organization by id
   **/
  @log()
  public async getOrganizationById(id: number): Promise<Organization> {
    const organization = await this.dao.get(id, { populate: ['labels', 'phone', 'address'] as never });
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${id}` }, friendly: true });
    }
    return organization;
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
    const forkedEntityManager = await this.dao.fork();
    await forkedEntityManager.begin();
    let organization: Organization;
    let keycloakOrganization;
    let adminRole;
    let keycloakpermissions: RoleRepresentation[] = [];
    try {
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
        // create keycloak sub_organization if the parent existe
        keycloakOrganization = await this.keycloakUtils.createGroup(`${grpPrifix}${payload.name}`, org.kcid);
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

      const organizationPhone = await this.phoneService.transactionalCreate({
        phoneLabel: payload.phone.phoneLabel,
        phoneCode: payload.phone.phoneCode,
        phoneNumber: payload.phone.phoneNumber,
      });

      wrappedOrganization.phone = organizationPhone;
      wrappedOrganization.parent = parent;
      wrappedOrganization.owner = user;
      const groupName = `${orgPrifix}${payload.name}`;

      // create keycloak organization in case it has no parent
      if (!payload.parent) {
        keycloakOrganization = await this.keycloakUtils.createGroup(groupName);
      }
      /**
       * create keycloak admin group as well as members group
       * and add the owner attribute to the organization in keycloak
       */

      const [adminGroup, membersGroup] = await Promise.all([
        this.keycloakUtils.createGroup(`${grpPrifix}admin`, keycloakOrganization),
        this.keycloakUtils.createGroup(`${grpPrifix}members`, keycloakOrganization),
        this.keycloakUtils.addOwnerToGroup(keycloakOrganization, groupName, user.keycloakId),
      ]);
      await this.keycloakUtils.addMemberToGroup(adminGroup, user.keycloakId);
      //create the role admin
      await this.keycloakUtils.createRealmRole(`${keycloakOrganization}-admin`);
      adminRole = await this.keycloakUtils.findRoleByName(`${keycloakOrganization}-admin`);
      //assign it to the admin group
      this.keycloakUtils.groupRoleMap(adminGroup, adminRole);
      //storing the KC groups ids
      wrappedOrganization.kcid = keycloakOrganization;
      wrappedOrganization.adminGroupkcid = adminGroup;
      wrappedOrganization.memberGroupkcid = membersGroup;
      const organizationSetting = await this.organizationSettingsService.transactionalCreate({
        hideAccountNumberWhenMakingReservation: AccountNumberVisibilty.EVERYONE,
      });

      const address = await this.addressService.transactionalCreate({
        city: payload.address.city,
        apartment: payload.address.apartment,
        country: payload.address.country,
        code: payload.address.code,
        province: payload.address.province,
        street: payload.address.street,
        type: AddressType.ORGANIZATION,
      });
      wrappedOrganization.address = address;
      wrappedOrganization.settings = organizationSetting;

      organization = await this.dao.transactionalCreate(wrappedOrganization);

      const DBAdminGroup = await this.groupService.transactionalCreate({
        organization,
        kcid: adminGroup,
        name: `${grpPrifix}admin`,
      });

      await this.groupService.transactionalCreate({
        organization,
        kcid: membersGroup,
        name: `${grpPrifix}member`,
      });

      await this.memberService.transactionalCreate({
        name: user.firstname + ' ' + user.lastname,
        user,
        active: true,
        organization,
        roles: [MemberTypeEnum.ADMIN],
        membership: MembershipStatus.ACCEPTED,
        status: userStatus.ACTIVE,
        joinDate: new Date(),
        workEmail: user.email,
        group: DBAdminGroup.id,
      });

      if (payload.labels?.length) {
        await this.labelService.createBulkLabelwithoutFlush(payload.labels, organization);
      }

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

      await this.infraService.transactionalCreate(defaultInfrastructure);

      // create the necessary CK Permissions
      const BDPermissions = (await this.permissionService.getByCriteria(
        { module: 'organization', operationDB: 'create' },
        FETCH_STRATEGY.ALL,
      )) as Permission[];
      if (BDPermissions) {
        for (const permission of BDPermissions) {
          this.keycloakUtils.createRealmRole(`${organization.kcid}-${permission.name}`);
          const role = this.keycloakUtils.findRoleByName(
            `${organization.kcid}-${permission.name}`,
          ) as RoleRepresentation;
          keycloakpermissions.push(role);
        }
      }

      await forkedEntityManager.commit();
    } catch (error) {
      if (keycloakOrganization) {
        await this.keycloakUtils.deleteGroup(keycloakOrganization);
      }
      if (adminRole) {
        await this.keycloakUtils.deleteRealmRole(`${keycloakOrganization}-admin`);
      }
      if (keycloakpermissions.length !== null) {
        await Promise.all(
          keycloakpermissions.map(async (permission: any) => {
            await this.keycloakUtils.deleteRealmRole(permission.name);
          }),
        );
      }
      await forkedEntityManager.rollback();
      throw error;
    }
    await this.dao.entitymanager.flush();
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
    const forkedEntityManager = await this.dao.fork();
    await forkedEntityManager.begin();
    let nameUpdated = false;
    let organization;
    try {
      organization = await this.dao.get(orgId);
      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` }, friendly: false });
      }

      if (organization.name !== payload.name) {
        //update the Kc group name
        await this.keycloakUtils.updateGroup(organization.kcid, {
          name: `${orgPrifix}${payload.name}`,
        });
        nameUpdated = true;
      }

      const wrappedOrganization = this.wrapEntity(organization, {
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

      if (payload.phone) {
        const phone = await this.phoneService.get(payload.phone.id);
        const updatedPhone = this.phoneService.wrapEntity(phone, {
          ...phone,
          phoneLabel: payload.phone.phoneLabel,
          phoneCode: payload.phone.phoneCode,
          phoneNumber: payload.phone.phoneNumber,
        });
        await this.phoneService.transactionalUpdate(updatedPhone);
      }

      if (payload.parent) {
        const parent = await this.dao.get(payload.parent);
        if (!parent) {
          throw new NotFoundError('ORG.NON_EXISTANT_PARENT_ORG');
        }
        wrappedOrganization.parent = parent;
      }

      await this.dao.transactionalUpdate(wrappedOrganization);
      await forkedEntityManager.commit();
    } catch (error) {
      //rollback the keycoak organization name changing
      if (nameUpdated == true) {
        await this.keycloakUtils.updateGroup(organization.kcid, {
          name: `${orgPrifix}${organization.name}`,
        });
      }
      await forkedEntityManager.rollback();
      throw error;
    }
    await this.dao.entitymanager.flush();
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

  /**
   * add new address to organization
   * @param orgId organization id
   * @param statusFilter Filter used to fetch organization
   * @param page
   * @param size
   */
  @log()
  public async getMembers(
    orgId: number,
    statusFilter?: string,
    page?: number,
    size?: number,
    query?: string,
  ): Promise<MembersList> {
    const organization = await this.dao.get(orgId);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId}` }, friendly: false });
    }
    const length = await organization.members.loadCount(true);
    let members;
    if (statusFilter) {
      if (page | size) {
        const skip = (page - 1) * size;
        if (query) {
          members = await this.memberService.getByCriteria(
            { organization, name: { $like: '%' + query + '%' }, status: statusFilter },
            FETCH_STRATEGY.ALL,
            {
              offset: skip,
              limit: size,
            },
          );
        } else {
          members = await this.memberService.getByCriteria({ organization, status: statusFilter }, FETCH_STRATEGY.ALL, {
            offset: skip,
            limit: size,
          });
        }
        const { data, pagination } = paginate(members, page, size, skip, length);
        const result: MembersList = {
          data,
          pagination,
        };
        return result;
      }
      members = await this.memberService.getByCriteria({ organization, status: statusFilter }, FETCH_STRATEGY.ALL);
      const result: MembersList = {
        data: members,
      };
      return result;
    } else {
      if (page | size) {
        const skip = page * size;
        if (query) {
          members = await this.memberService.getByCriteria(
            { organization, name: { $like: '%' + query + '%' } },
            FETCH_STRATEGY.ALL,
            {
              offset: skip,
              limit: size,
            },
          );
        } else {
          members = await this.memberService.getByCriteria({ organization }, FETCH_STRATEGY.ALL, {
            offset: skip,
            limit: size,
          });
        }
        const { data, pagination } = paginate(members, page, size, skip, length);
        const result: MembersList = {
          data,
          pagination,
        };
        return result;
      }
      members = await this.memberService.getByCriteria({ organization }, FETCH_STRATEGY.ALL);
      const result: MembersList = {
        data: members,
      };
      return result;
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

    //clean the org permision
    const BDPermissions = (await this.permissionService.getByCriteria(
      { module: 'organization', operationDB: 'create' },
      FETCH_STRATEGY.ALL,
    )) as Permission[];
    if (BDPermissions) {
      for (const permission of BDPermissions) {
        this.keycloakUtils.deleteRealmRole(`${fetchedorganization.kcid}-${permission.name}`);
      }
    }

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

  /* Update localization settings of an organization ,
   *
   * @param payload
   * @param id of the requested organization
   *
   */
  @log()
  public async updateOrganizationLocalisationSettings(
    payload: OrganizationlocalisationSettingsRO,
    organizationId: number,
  ): Promise<number> {
    const forkedEntityManager = await this.dao.fork();
    await forkedEntityManager.begin();
    try {
      const fetchedOrganization = await this.dao.get(organizationId);
      if (!fetchedOrganization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
          variables: { org: `${organizationId}` },
          friendly: false,
        });
      }
      const organizationAddress = fetchedOrganization.address;
      const newAddress = this.addressService.wrapEntity(organizationAddress, {
        organizationAddress,
        ...payload,
      });

      await this.addressService.transactionalUpdate(newAddress);

      const oldSetting = fetchedOrganization.settings;
      const newSettings = this.organizationSettingsService.wrapEntity(oldSetting, {
        ...oldSetting,
        ...payload,
      });
      await this.organizationSettingsService.transactionalUpdate(newSettings);
      await forkedEntityManager.commit();
    } catch (error) {
      await forkedEntityManager.rollback();
      throw error;
    }
    await this.dao.entitymanager.flush();
    return organizationId;
  }

  /* retrieve localization settings of an organization ,
   *
   * @param payload
   * @param id of the requested organization
   *
   */
  @log()
  public async getOrganizationLocalisation(organizationId: number): Promise<any> {
    const fetchedOrganization = (await this.get(organizationId)) as Organization;
    if (!fetchedOrganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${organizationId}` },
        friendly: false,
      });
    }
    const data: localisationSettingsType = {
      localisationDataFromOrgAdress: fetchedOrganization.address,
      localisationDataFromOrgSettings: fetchedOrganization.settings,
    };
    return data;
  }
}
