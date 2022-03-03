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
  private async checkEntitiesExistence(organization: number, resource: number): Promise<Result<any>> {
    let currentOrg, currentRes;
    if (organization) {
      currentOrg = await this.organizationService.get(organization);
      if (currentOrg.isFailure || currentOrg.getValue() === null) {
        return Result.fail<number>(`Organization with id ${organization} does not exist.`);
      }
    }
    if (resource) {
      currentRes = await this.resourceService.get(resource);
      if (currentRes.isFailure || currentRes.getValue() === null) {
        return Result.fail<number>(`Resource with id ${resource} does not exist.`);
      }
    }
    return Result.ok({ currentOrg, currentRes });
  }

  @log()
  @safeGuard()
  private async handleAddressForMemeber(payload: MemberRO, isUpdate = false): Promise<Result<any>> {
    let createdWorkLocation;

    if (isUpdate) {
      if (payload.workLocation) {
        const fetchedWorkLocation = await this.addressService.get(payload.workLocation.id);
        if (fetchedWorkLocation.isFailure) return Result.fail(fetchedWorkLocation.error);
        const workLocation = {
          ...fetchedWorkLocation.getValue(),
          ...payload.workLocation,
        };
        this.addressService.update(workLocation);
      }
    }

    if (payload.workLocation) createdWorkLocation = await this.addressService.createAddress(payload.workLocation);

    if (payload.workLocation && createdWorkLocation.isFailure) {
      return Result.fail<number>(createdWorkLocation.error);
    }

    const workLocation = payload.workLocation ? createdWorkLocation.getValue() : null;

    return Result.ok({ workLocation });
  }

  @log()
  @safeGuard()
  private async handlePhonesForMemeber(payload: MemberRO, member: Member, isUpdate = false): Promise<Result<any>> {
    let createdWorkPhone, createdEmergencyPhone;

    if (isUpdate) {
      if (payload.workPhone) {
        const fetchedWorkPhone = await this.phoneService.get(payload.workPhone.id);
        if (fetchedWorkPhone.isFailure) return Result.fail(fetchedWorkPhone.error);
        const workPhone = {
          ...fetchedWorkPhone.getValue(),
          ...payload.workPhone,
        };
        this.phoneService.update(workPhone);
      }
      if (payload.emergencyPhone) {
        const fetchedEmergencyPhone = await this.phoneService.get(payload.emergencyPhone.id);
        if (fetchedEmergencyPhone.isFailure) return Result.fail(fetchedEmergencyPhone.error);
        const emergencyPhone = {
          ...fetchedEmergencyPhone.getValue(),
          ...payload.emergencyPhone,
        };
        this.phoneService.update(emergencyPhone);
      }
    }

    if (payload.workPhone) createdWorkPhone = await this.phoneService.createPhoneForMember(payload.workPhone, member);
    if (payload.emergencyPhone)
      createdEmergencyPhone = await this.phoneService.createPhoneForMember(payload.emergencyPhone, member);

    if (payload.workPhone && createdWorkPhone.isFailure) {
      return Result.fail<number>(createdWorkPhone.error);
    } else if (payload.emergencyPhone && createdEmergencyPhone.isFailure) {
      await this.phoneService.remove(createdWorkPhone.getValue().id);
      return Result.fail<number>(createdEmergencyPhone.error);
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
  public async createMember(@validateParam(CreateMemberSchema) payload: MemberRO): Promise<Result<number>> {
    const existence = await this.checkEntitiesExistence(payload.organization, payload.resource);
    if (existence.isFailure) return Result.fail<number>(existence.error);
    const { currentOrg, currentRes } = await existence.getValue();

    const addresss = await this.handleAddressForMemeber(payload);
    if (addresss.isFailure) return Result.fail<number>(addresss.error);
    const { workLocation } = await addresss.getValue();

    const member = {
      ...payload,
      organization: currentOrg.getValue(),
      resource: currentRes.getValue(),
      workLocation,
    };

    const createdMemberResult = await this.create(this.wrapEntity(this.dao.model, member));

    if (createdMemberResult.isFailure) {
      return Result.fail<number>(createdMemberResult.error);
    }

    const createdMember = createdMemberResult.getValue();

    const phones = await this.handlePhonesForMemeber(payload, createdMember);
    if (phones.isFailure) {
      {
        return Result.fail<number>(existence.error);
      }
    }
    const { workPhone, emergencyPhone } = await phones.getValue();
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
  ): Promise<Result<number>> {
    const member = await this.dao.get(memberId);
    if (!member) {
      return Result.fail<number>(`Member with id ${memberId} does not exist`);
    }

    const existence = await this.checkEntitiesExistence(payload.organization, payload.resource);
    if (existence.isFailure) {
      return Result.fail<number>(existence.error);
    }
    delete payload.organization, payload.resource;
    const { currentOrg, currentRes } = await existence.getValue();

    const addresss = await this.handleAddressForMemeber(payload, true);
    if (addresss.isFailure) return Result.fail<number>(addresss.error);
    const { workLocation } = await addresss.getValue();

    const phones = await this.handlePhonesForMemeber(payload, member, true);
    if (phones.isFailure) {
      return Result.fail<number>(existence.error);
    }
    const { workPhone, emergencyPhone } = await phones.getValue();

    const _member = this.wrapEntity(member, {
      ...member,
      ...payload,
      organization: currentOrg ? currentOrg.getValue() : member.organization,
      resource: currentRes ? currentRes.getValue() : member.resource,
      workLocation: workLocation ? workLocation : member.workLocation,
      workPhone: workPhone ? workPhone : member.workPhone,
      emergencyPhone: emergencyPhone ? emergencyPhone : member.emergencyPhone,
    });

    const updatedMember = await this.update(_member);
    if (updatedMember.isFailure) {
      return Result.fail<number>(updatedMember.error);
    }
    return Result.ok(updatedMember.getValue().id);
  }
}
