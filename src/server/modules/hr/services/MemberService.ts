import { Phone } from './../../phones/models/Phone';
import { Address } from './../../address/models/AdressModel';
import { Resource } from './../../resources/models/Resource';
import { Organization } from './../../organizations/models/Organization';
import { MemberRO } from '@/modules/hr/routes/RequestObject';
import { CreateMemberSchema, UpdateMemberSchema } from '@/modules/hr/schemas/MemberSchema';
import { container, provideSingleton } from '@/di/index';

import { BaseService } from '@/modules/base/services/BaseService';
import { IAddressService } from '@/modules/address/interfaces/IAddressService';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IOrganizationService } from '@/modules/organizations/interfaces';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { IResourceService } from '@/modules/resources/interfaces';
import { Member } from '@/modules/hr/models/Member';
import { MemberDao } from '@/modules/hr/daos/MemberDao';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { validate } from '@/decorators/validate';
import { validateParam } from '@/decorators/validateParam';

type OrganizationAndResource = { currentOrg: Organization; currentRes: Resource };
type WorkAndEmergencyPhone = { workPhone: Phone; emergencyPhone: Phone };

@provideSingleton(IMemberService)
export class MemberService extends BaseService<Member> implements IMemberService {
  constructor(
    public dao: MemberDao,
    public organizationService: IOrganizationService,
    public addressService: IAddressService,
    public phoneService: IPhoneService,
    public resourceService: IResourceService,
  ) {
    super(dao);
  }

  static getInstance(): IMemberService {
    return container.get(IMemberService);
  }

  @log()
  @safeGuard()
  private async checkEntitiesExistence(
    organization: number,
    resource: number,
  ): Promise<Result<OrganizationAndResource | string>> {
    let currentOrg;
    let currentRes;
    if (organization) {
      currentOrg = await this.organizationService.get(organization);
      if (currentOrg.isFailure || currentOrg.getValue() === null) {
        return Result.fail(`Organization with id ${organization} does not exist.`);
      }
    }
    if (resource) {
      currentRes = await this.resourceService.get(resource);
      if (currentRes.isFailure || currentRes.getValue() === null) {
        return Result.fail(`Resource with id ${resource} does not exist.`);
      }
    }
    return Result.ok({ currentOrg: currentOrg.getValue(), currentRes: currentRes.getValue() });
  }

  @log()
  @safeGuard()
  private async handleAddressForMemeber(payload: MemberRO, isUpdate = false): Promise<Result<Address | string>> {
    let createdWorkLocation;

    if (isUpdate) {
      if (payload.workLocation) {
        const fetchedWorkLocation = await this.addressService.get(payload.workLocation.id);
        if (fetchedWorkLocation.isFailure) {
          return fetchedWorkLocation;
        }
        const workLocation = {
          ...fetchedWorkLocation.getValue(),
          ...payload.workLocation,
        };
        this.addressService.update(workLocation);
      }
    }

    if (payload.workLocation) createdWorkLocation = await this.addressService.createAddress(payload.workLocation);

    if (payload.workLocation && createdWorkLocation.isFailure) {
      return Result.fail(createdWorkLocation.error);
    }

    const workLocation = payload.workLocation ? createdWorkLocation.getValue() : null;

    return Result.ok(workLocation);
  }

  @log()
  @safeGuard()
  private async handlePhonesForMemeber(
    payload: MemberRO,
    member: Member,
    isUpdate = false,
  ): Promise<Result<WorkAndEmergencyPhone | string>> {
    let createdWorkPhone;
    let createdEmergencyPhone;

    if (isUpdate) {
      if (payload.workPhone) {
        const fetchedWorkPhone = await this.phoneService.get(payload.workPhone.id);
        if (fetchedWorkPhone.isFailure) {
          return fetchedWorkPhone;
        }
        const workPhone = {
          ...fetchedWorkPhone.getValue(),
          ...payload.workPhone,
        };
        this.phoneService.update(workPhone);
      }
      if (payload.emergencyPhone) {
        const fetchedEmergencyPhone = await this.phoneService.get(payload.emergencyPhone.id);
        if (fetchedEmergencyPhone.isFailure) {
          return fetchedEmergencyPhone;
        }
        const emergencyPhone = {
          ...fetchedEmergencyPhone.getValue(),
          ...payload.emergencyPhone,
        };
        this.phoneService.update(emergencyPhone);
      }
    }

    if (payload.workPhone) {
      createdWorkPhone = await this.phoneService.createPhoneForMember(payload.workPhone, member);
    }
    if (payload.emergencyPhone) {
      createdEmergencyPhone = await this.phoneService.createPhoneForMember(payload.emergencyPhone, member);
    }

    if (payload.workPhone && createdWorkPhone.isFailure) {
      return Result.fail(createdWorkPhone.error);
    } else if (payload.emergencyPhone && createdEmergencyPhone.isFailure) {
      await this.phoneService.remove(createdWorkPhone.getValue().id);
      return Result.fail(createdEmergencyPhone.error);
    }

    const workPhone = payload.workPhone ? createdWorkPhone.getValue() : null;
    const emergencyPhone = payload.emergencyPhone ? createdEmergencyPhone.getValue() : null;

    return Result.ok({ workPhone, emergencyPhone });
  }

  /**
   * Override the create method
   */
  @log()
  @safeGuard()
  @validate
  public async createMember(@validateParam(CreateMemberSchema) payload: MemberRO): Promise<Result<number | string>> {
    const existence = await this.checkEntitiesExistence(payload.organization, payload.resource);
    if (existence.isFailure) {
      return Result.fail(existence.error);
    }
    const { currentOrg, currentRes } = existence.getValue() as OrganizationAndResource;

    const addresss = await this.handleAddressForMemeber(payload);
    if (addresss.isFailure) {
      return Result.fail(addresss.error);
    }
    const workLocation = addresss.getValue();

    const member = {
      ...payload,
      organization: currentOrg,
      resource: currentRes,
      workLocation,
    };

    const createdMemberResult = await this.create(this.wrapEntity(this.dao.model, member));

    if (createdMemberResult.isFailure) {
      return createdMemberResult;
    }

    const createdMember = createdMemberResult.getValue();

    const phones = await this.handlePhonesForMemeber(payload, createdMember);
    if (phones.isFailure) {
      return Result.fail<number>(existence.error);
    }
    const { workPhone, emergencyPhone } = phones.getValue() as WorkAndEmergencyPhone;
    createdMember.workPhone = workPhone;
    createdMember.emergencyPhone = emergencyPhone;
    await this.update(createdMember);

    return Result.ok(createdMember.getValue().id);
  }

  /**
   * Override the update method
   */
  @log()
  @safeGuard()
  @validate
  public async updateMember(
    @validateParam(UpdateMemberSchema) payload: MemberRO,
    memberId: number,
  ): Promise<Result<number | string>> {
    const member = await this.dao.get(memberId);
    if (!member) {
      return Result.fail<number>(`Member with id ${memberId} does not exist`);
    }

    const existence = await this.checkEntitiesExistence(payload.organization, payload.resource);
    if (existence.isFailure) {
      return Result.fail(existence.error);
    }
    delete payload.organization, payload.resource;
    const { currentOrg, currentRes } = existence.getValue() as OrganizationAndResource;

    const addresss = await this.handleAddressForMemeber(payload, true);
    if (addresss.isFailure) {
      return Result.fail(addresss.error);
    }
    const workLocation = addresss.getValue();

    const phones = await this.handlePhonesForMemeber(payload, member, true);
    if (phones.isFailure) {
      return Result.fail(phones.error);
    }
    const { workPhone, emergencyPhone } = phones.getValue() as WorkAndEmergencyPhone;

    const _member = this.wrapEntity(member, {
      ...member,
      ...payload,
      organization: currentOrg ? currentOrg : member.organization,
      resource: currentRes ? currentRes : member.resource,
      workLocation: workLocation ? workLocation : member.workLocation,
      workPhone: workPhone ? workPhone : member.workPhone,
      emergencyPhone: emergencyPhone ? emergencyPhone : member.emergencyPhone,
    });

    const updatedMember = await this.update(_member);
    if (updatedMember.isFailure) {
      return updatedMember;
    }
    return Result.ok(updatedMember.getValue().id);
  }
}
