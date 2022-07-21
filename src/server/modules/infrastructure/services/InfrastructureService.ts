import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { infrastructureDAO } from '@/modules/infrastructure/daos/infrastructureDAO';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { validate } from '@/decorators/validate';
import { safeGuard } from '@/decorators/safeGuard';
import { log } from '@/decorators/log';
import { validateParam } from '@/decorators/validateParam';
import { Result } from '@/utils/Result';
import {
  CreateOrganizationSchema,
  UpdateInfrastructureSchema,
} from '@/modules/infrastructure/schemas/ifrastructureSchemas';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { InfrastructureRO, UpdateinfrastructureRO } from '@/modules/infrastructure/routes/RequestObject';
import { applyToAll } from '@/utils/utilities';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { FETCH_STRATEGY } from '@/modules/base';
import { Organization } from '@/modules/organizations';
import { IResourceService } from '@/modules/resources';

@provideSingleton(IInfrastructureService)
export class InfrastructureService extends BaseService<Infrastructure> implements IInfrastructureService {
  constructor(
    public dao: infrastructureDAO,
    public organizationService: IOrganizationService,
    public memberService: IMemberService,
    public userService: IUserService,
    public resourceService: IResourceService,
  ) {
    super(dao);
  }
  static getInstance(): IInfrastructureService {
    return container.get(IInfrastructureService);
  }
  /**
   * create an infrastructure
   * @param payload represents the infrastructure information to persist
   */
  @log()
  @safeGuard()
  @validate
  public async createInfrustructure(
    @validateParam(CreateOrganizationSchema) payload: InfrastructureRO,
  ): Promise<Result<number>> {
    const fetchedOrganization = await this.organizationService.get(payload.organization);
    if (fetchedOrganization.isFailure) {
      return Result.fail(`failed to retreive org with id ${payload.organization}`);
    }
    if (!fetchedOrganization.getValue()) {
      return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
    }
    const organization = fetchedOrganization.getValue();

    const responsables = payload.responsables;
    const fetchedResponsables = await applyToAll(responsables, async (responsable) => {
      const fetchedUser = (await this.userService.get(responsable)).getValue();
      if (fetchedUser.isFailure) {
        return Result.fail(`fail to retreive user with id ${responsable}.`);
      }
      if (!fetchedUser.getValue()) {
        return Result.notFound(`user with id ${responsable} does not exist.`);
      }
      const fetchedRes = await this.memberService.getByCriteria(
        { user: fetchedUser, organization: organization },
        FETCH_STRATEGY.SINGLE,
      );
      if (fetchedRes.isFailure) {
        return Result.fail(
          `fail to retreive the membeship of user ${responsable} with id on org with id${organization} `,
        );
      }
      if (!fetchedRes.getValue()) {
        return Result.notFound(`User with id ${responsable} is not member in org with id ${organization.id}.`);
      }

      return fetchedRes.getValue();
    });
    // check if the key is unique
    const fetchedKey = await this.dao.getByCriteria({ key: payload.key });

    if (fetchedKey) {
      return Result.fail(`Infrustructure key ${payload.key} already exist.`);
    }

    // check the existance of the resources
    let fetchedResources;
    if (!payload.resources) {
      const resources = payload.resources;
      fetchedResources = await applyToAll(resources, async (resource) => {
        const fetchedResource = await this.resourceService.get(resource);
        if (fetchedResource.isFailure) {
          return Result.fail(`fail in retreive Resource with id ${resource}`);
        }
        if (!fetchedResource) {
          return Result.notFound(`Resource with id ${resource} does not exist.`);
        }
        return fetchedResource.getValue();
      });
    }

    // check the existance of the parent
    let fetchedParent;
    if (!payload.parent) {
      fetchedParent = await this.dao.get(payload.parent);
      if (!fetchedParent) {
        return Result.notFound(`Infrastructure with id: ${fetchedParent.id} does not exist.`);
      }
    }

    const createdInfustructure = this.wrapEntity(Infrastructure.getInstance(), {
      ...payload,
      organization,
      responsibles: fetchedResponsables,
      resources: fetchedResources,
      parent: fetchedParent,
    });
    await this.dao.create(createdInfustructure);
    return Result.ok<number>(createdInfustructure.id);
  }

  /**
   * update an infrastructure
   * @param payload represents the infrastructure information to update
   */
  @log()
  @safeGuard()
  @validate
  public async updateInfrastructure(
    @validateParam(UpdateInfrastructureSchema) payload: UpdateinfrastructureRO,
    infraId: number,
  ): Promise<Result<number>> {
    const fetchedInfrastructure = await this.dao.get(infraId);
    if (!fetchedInfrastructure) {
      return Result.notFound(`infrustructure with id ${infraId} does not exist.`);
    }

    let organization = Organization.getInstance();
    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (fetchedOrganization.isFailure) {
        return Result.fail(`failed to retreive org with id ${payload.organization}`);
      }
      if (!fetchedOrganization.getValue()) {
        return Result.notFound(`Organization with id ${payload.organization} does not exist.`);
      }
      organization = fetchedOrganization.getValue();
    }
    const responsables = payload.responsables;
    const fetchedResponsables = await applyToAll(responsables, async (responsable) => {
      const fetchedUser = (await this.userService.get(responsable)).getValue();
      if (fetchedUser.isFailure) {
        return Result.fail(`fail to retreive user with id ${responsable}.`);
      }
      if (!fetchedUser.getValue()) {
        return Result.notFound(`user with id ${responsable} does not exist.`);
      }
      const fetchedRes = await this.memberService.getByCriteria(
        { user: fetchedUser, organization: organization },
        FETCH_STRATEGY.SINGLE,
      );
      if (fetchedRes.isFailure) {
        return Result.fail(
          `fail to retreive the membeship of user ${responsable} with id on org with id${organization} `,
        );
      }
      if (!fetchedRes.getValue()) {
        return Result.notFound(`User with id ${responsable} is not member in org with id ${organization.id}.`);
      }

      return fetchedRes.getValue();
    });

    // check if the key is unique
    const fetchedKey = await this.dao.getByCriteria({ key: payload.key });
    if (fetchedKey) {
      return Result.fail(`Infrustructure key ${payload.key} already exist.`);
    }
    // check the existance of the resources
    let fetchedResources;
    if (!payload.resources) {
      const resources = payload.resources;
      fetchedResources = await applyToAll(resources, async (resource) => {
        const fetchedResource = await this.resourceService.get(resource);
        if (fetchedResource.isFailure) {
          return Result.fail(`fail in retreive Resource with id ${resource}`);
        }
        if (!fetchedResource) {
          return Result.notFound(`Resource with id ${resource} does not exist.`);
        }
        return fetchedResource.getValue();
      });
    }

    // check the existance of the parent
    let fetchedParent;
    if (!payload.parent) {
      fetchedParent = await this.dao.get(payload.parent);
      if (!fetchedParent) {
        return Result.notFound(`Infrastructure with id: ${fetchedParent.id} does not exist.`);
      }
    }

    const infrustructure = this.wrapEntity(fetchedInfrastructure, {
      ...fetchedInfrastructure,
      ...payload,
      organization,
      responsibles: fetchedResponsables,
      resources: fetchedResources,
      parent: fetchedParent,
    });

    const createdResource = await this.dao.update(infrustructure);
    if (!createdResource) {
      return Result.fail(`infrustructure with id ${infraId} can not be updated.`);
    }

    const id = createdResource.id;
    return Result.ok<number>(id);
  }
}
