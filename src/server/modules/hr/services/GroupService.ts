import { container, provideSingleton } from '@/di/index';
import { BaseService } from '@/modules/base/services/BaseService';
import { Group } from '@/modules/hr/models/Group';
import { GroupDAO } from '@/modules/hr/daos/GroupDAO';
import { IGroupService } from '@/modules/hr/interfaces/IGroupService';
import { Result } from '@/utils/Result';
import { log } from '@/decorators/log';
import { safeGuard } from '@/decorators/safeGuard';
import { GroupRO } from '@/modules/hr//routes/RequestObject';
import { getConfig } from '@/configuration/Configuration';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';

@provideSingleton(IGroupService)
export class GroupService extends BaseService<Group> implements IGroupService {
  constructor(public dao: GroupDAO, public organizationService: IOrganizationService) {
    super(dao);
  }

  static getInstance(): IGroupService {
    return container.get(IGroupService);
  }

  @log()
  @safeGuard()
  // @validate
  public async createGroup(payload: GroupRO): Promise<Result<number>> {
    const fetchedorganization = await this.organizationService.get(payload.organization);
    if (fetchedorganization.isFailure || fetchedorganization.getValue() !== null) {
      return Result.notFound(`organization with id ${payload.organization} does not exist.`);
    }

    const fetchedorganizationValue = fetchedorganization.getValue();
    const wrappedGroup = this.wrapEntity(new Group(), {
      name: payload.name,
      active: payload.active,
      parent: payload.parent,
      note: payload.note,
    });

    wrappedGroup.organization = fetchedorganizationValue;

    const createdGroup = await this.dao.create(wrappedGroup);
    await this.keycloak.getAdminClient().groups.setOrCreateChild(
      { id: fetchedorganizationValue.kcid, realm: getConfig('keycloak.clientValidation.realmName') },
      {
        name: payload.name,
      },
    );
    return Result.ok<number>(createdGroup.id);
  }

  @log()
  @safeGuard()
  // @validate
  public async updateGroup(payload: GroupRO, groupId: number): Promise<Result<number>> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      return Result.notFound(`group with id ${groupId} does not exist.`);
    }

    if (fetchedGroup.name !== payload.name) {
      await this.keycloak.getAdminClient().groups.setOrCreateChild(
        { id: fetchedGroup.kcid, realm: getConfig('keycloak.clientValidation.realmName') },
        {
          name: payload.name,
        },
      );
    }

    const fetchedorganization = await this.organizationService.get(payload.organization);
    if (fetchedorganization.isFailure || fetchedorganization.getValue() !== null) {
      return Result.notFound(`organization with id ${payload.organization} does not exist.`);
    }
    const group = await this.dao.get(groupId);
    this.wrapEntity(group, {
      ...group,
    });
    return Result.ok<number>(1);
  }

  @log()
  @safeGuard()
  // @validate
  public async deleteGroup(groupId: number): Promise<Result<number>> {
    const fetchedGroup = await this.dao.get(groupId);
    if (!fetchedGroup) {
      return Result.notFound(`group with id ${groupId} does not exist.`);
    }
    await this.dao.remove(fetchedGroup);
    await this.keycloak.getAdminClient().groups.del({
      id: fetchedGroup.kcid,
      realm: getConfig('keycloak.clientValidation.realmName'),
    });
    return Result.ok<number>(groupId);
  }
}
