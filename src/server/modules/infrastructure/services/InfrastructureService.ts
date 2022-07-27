import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container } from '@/di/index';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { infrastructureDAO } from '@/modules/infrastructure/daos/infrastructureDAO';
import { IInfrastructureService } from '@/modules/infrastructure/interfaces/IInfrastructureService';
import { validate } from '@/decorators/validate';
import { log } from '@/decorators/log';
import { validateParam } from '@/decorators/validateParam';
import {
  CreateOrganizationSchema,
  UpdateInfrastructureSchema,
} from '@/modules/infrastructure/schemas/ifrastructureSchemas';
import { IOrganizationService } from '@/modules/organizations/interfaces/IOrganizationService';
import { InfrastructureRO, UpdateinfrastructureRO } from '@/modules/infrastructure/routes/RequestObject';
import { applyToAll } from '@/utils/utilities';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { Organization } from '@/modules/organizations/models/Organization';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { NotFoundError } from '@/Exceptions';
import { ConflictError } from '@/Exceptions/ConflictError';
import { BadRequest } from '@/Exceptions/BadRequestError';

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
  @validate
  public async createInfrustructure(
    @validateParam(CreateOrganizationSchema) payload: InfrastructureRO,
  ): Promise<number> {
    const fetchedOrganization = await this.organizationService.get(payload.organization);
    if (!fetchedOrganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${payload.organization}` },
        friendly: false,
      });
    }

    const organization = fetchedOrganization.getValue();

    const responsables = payload.responsables;
    const fetchedResponsables = await applyToAll(responsables, async (responsable) => {
      const fetchedUser = (await this.userService.get(responsable)).getValue();
      if (!fetchedUser) {
        throw new NotFoundError('USER.NON_EXISTANT_DATA {{user}}', {
          variables: { user: `${responsable}` },
          friendly: false,
        });
      }
      const fetchedRes = await this.memberService.getByCriteria(
        { user: fetchedUser, organization: organization },
        FETCH_STRATEGY.SINGLE,
      );
      if (fetchedRes) {
        throw new NotFoundError('MEMBER.NON_EXISTANT_DATA {{member}}', {
          variables: { member: `${responsable}` },
          friendly: false,
        });
      }
      return fetchedRes.getValue();
    });
    // check if the key is unique
    const fetchedKey = await this.dao.getByCriteria({ key: payload.key });

    if (fetchedKey) {
      throw new ConflictError('{{key}} ALREADY_EXISTS', { variables: { key: `${payload.key}` }, friendly: true });
    }

    // check the existance of the resources
    let fetchedResources;
    if (!payload.resources) {
      const resources = payload.resources;
      fetchedResources = await applyToAll(resources, async (resource) => {
        const fetchedResource = await this.resourceService.get(resource);
        if (!fetchedResource) {
          throw new NotFoundError('RESOURCE.NON_EXISTANT_USER {{resource}}', {
            variables: { resource: `${resource}` },
          });
        }
        return fetchedResource.getValue();
      });
    }

    // check the existance of the parent
    let fetchedParent;
    if (!payload.parent) {
      fetchedParent = await this.dao.get(payload.parent);
      if (!fetchedParent) {
        throw new NotFoundError('ORG.NON_EXISTANT_PARENT_ORG', { friendly: true });
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
    return createdInfustructure.id;
  }

  /**
   * update an infrastructure
   * @param payload represents the infrastructure information to update
   */
  @log()
  @validate
  public async updateInfrastructure(
    @validateParam(UpdateInfrastructureSchema) payload: UpdateinfrastructureRO,
    infraId: number,
  ): Promise<number> {
    const fetchedInfrastructure = await this.dao.get(infraId);
    if (!fetchedInfrastructure) {
      throw new NotFoundError('INFR.NON_EXISTANT_USER {{infr}}', { variables: { infr: `${infraId}` } });
    }

    let organization = Organization.getInstance();
    if (payload.organization) {
      const fetchedOrganization = await this.organizationService.get(payload.organization);
      if (!fetchedOrganization.getValue()) {
        throw new NotFoundError('ORG.NON_EXISTANT_USER {{org}}', { variables: { org: `${payload.organization}` } });
      }
      organization = fetchedOrganization.getValue();
    }
    const responsables = payload.responsables;
    const fetchedResponsables = await applyToAll(responsables, async (responsable) => {
      const fetchedUser = (await this.userService.get(responsable)).getValue();
      if (!fetchedUser) {
        throw new NotFoundError('USER.NON_EXISTANT_USER {{user}}', { variables: { user: `${responsable}` } });
      }
      const fetchedRes = await this.memberService.getByCriteria(
        { user: fetchedUser, organization: organization },
        FETCH_STRATEGY.SINGLE,
      );
      if (!fetchedRes.getValue()) {
        throw new NotFoundError('MEMBER.NON_EXISTANT_DATA {{member}}', {
          variables: { member: `${responsable}` },
          friendly: false,
        });
      }

      return fetchedRes.getValue();
    });

    // check if the key is unique
    const fetchedKey = await this.dao.getByCriteria({ key: payload.key });
    if (fetchedKey) {
      throw new ConflictError('{{key}} ALREADY_EXISTS', { variables: { key: `${payload.key}` }, friendly: true });
    }
    // check the existance of the resources
    let fetchedResources;
    if (!payload.resources) {
      const resources = payload.resources;
      fetchedResources = await applyToAll(resources, async (resource) => {
        const fetchedResource = await this.resourceService.get(resource);
        if (!fetchedResource) {
          throw new NotFoundError('RESOURCE.NON_EXISTANT_USER {{resource}}', {
            variables: { resource: `${resource}` },
          });
        }
        return fetchedResource.getValue();
      });
    }

    // check the existance of the parent
    let fetchedParent;
    if (!payload.parent) {
      fetchedParent = await this.dao.get(payload.parent);
      if (!fetchedParent) {
        throw new NotFoundError('ORG.NON_EXISTANT_PARENT_ORG', { friendly: true });
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

    const updatedResource = await this.dao.update(infrustructure);
    if (!updatedResource) {
      throw new BadRequest('USER.CANNOT_RESEND_INVITE_TO_ACTIVE_USER', { friendly: true });
    }

    const id = updatedResource.id;
    return id;
  }
}
