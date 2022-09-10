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
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { ConflictError } from '@/Exceptions/ConflictError';
import { Organization } from '@/modules/organizations/models/Organization';

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

  /** Get all the infrastructure of an organization ,
   * @param id of the requested organization
   *
   */
  @log()
  public async getAllOgranizationInfrastructures(orgId: number): Promise<Infrastructure[]> {
    const fetchedOrganization = await this.organizationService.get(orgId);

    if (!fetchedOrganization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${orgId}` },
        friendly: true,
      });
    }
    return await fetchedOrganization.infrastructure.init();
  }

  /**
   * create an infrastructure
   * @param payload represents the infrastructure information to persist
   */
  @log()
  @validate
  public async createinfrastructure(
    @validateParam(CreateOrganizationSchema) payload: InfrastructureRO,
  ): Promise<number> {
    const organization = await this.organizationService.get(payload.organization);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${payload.organization}` },
        friendly: false,
      });
    }
    // check the existance of the parent
    let fetchedParent;
    if (payload.parent) {
      fetchedParent = await this.dao.get(payload.parent);
      if (!fetchedParent) {
        throw new NotFoundError('ORG.NON_EXISTANT_PARENT_ORG', { friendly: true });
      }
    }

    // check if the key is unique
    const keyExistingTest = await this.dao.getByCriteria({ key: payload.key });

    if (keyExistingTest) {
      throw new ConflictError('{{key}} ALREADY_EXISTS', { variables: { key: `${payload.key}` }, friendly: true });
    }

    let fetchedResponsables;
    if (payload.responsibles) {
      const responsables = payload.responsibles;
      await responsables.map(async (res) => {
        const user = await this.userService.get(res);
        if (!user) {
          throw new NotFoundError('USER.NON_EXISTANT_DATA {{user}}', {
            variables: { user: `${res}` },
            friendly: false,
          });
        }
        const responsable = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
        if (!responsable) {
          throw new NotFoundError('MEMBER.NON_EXISTANT_DATA {{member}}', {
            variables: { member: `${res}` },
            friendly: false,
          });
        }
        fetchedResponsables.push(responsable);
      });
    }
    // check the existance of the resources
    let fetchedResources;
    if (payload.resources) {
      const resources = payload.resources;
      await applyToAll(resources, async (resource) => {
        const fetchedResource = await this.resourceService.get(resource);
        if (!fetchedResource) {
          throw new NotFoundError('RESOURCE.NON_EXISTANT_USER {{resource}}', {
            variables: { resource: `${resource}` },
          });
        }
        fetchedResources.push(fetchedResource);
      });
    }

    const wrappedInfustructure = this.wrapEntity(Infrastructure.getInstance(), {
      name: payload.name,
      description: payload.description,
      key: payload.key,
    });
    wrappedInfustructure.organization = organization;
    wrappedInfustructure.resources = fetchedResources;
    wrappedInfustructure.responsibles = fetchedResponsables;
    wrappedInfustructure.parent = fetchedParent;

    const createdInfustructure = await this.create(wrappedInfustructure);
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
      throw new NotFoundError('INFRAS.NON_EXISTANT_DATA {{infra}}', { variables: { infra: `${infraId}` } });
    }
    const wrappedInfustructure = this.wrapEntity(fetchedInfrastructure, {
      ...fetchedInfrastructure,
      name: payload.name || fetchedInfrastructure.name,
      description: payload.description || fetchedInfrastructure.description,
      key: payload.key || fetchedInfrastructure.key,
    });
    let organization: Organization;
    if (payload.organization) {
      organization = await this.organizationService.get(payload.organization);
      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
          variables: { org: `${payload.organization}` },
          friendly: false,
        });
      }
      wrappedInfustructure.organization = organization;
    }

    let fetchedResponsables;
    if (payload.responsibles) {
      const responsables = payload.responsibles;
      await responsables.map(async (res) => {
        const user = await this.userService.get(res);
        if (!user) {
          throw new NotFoundError('USER.NON_EXISTANT_DATA {{user}}', {
            variables: { user: `${res}` },
            friendly: false,
          });
        }
        const responsable = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
        if (!responsable) {
          throw new NotFoundError('MEMBER.NON_EXISTANT_DATA {{member}}', {
            variables: { member: `${res}` },
            friendly: false,
          });
        }
        fetchedResponsables.push(responsable);
      });
      wrappedInfustructure.responsibles = fetchedResponsables;
    }
    // check if the key is unique
    const keyExistingTest = await this.dao.getByCriteria({ key: payload.key });

    if (keyExistingTest) {
      throw new ConflictError('{{key}} ALREADY_EXISTS', { variables: { key: `${payload.key}` }, friendly: true });
    }

    // check the existance of the resources
    let fetchedResources;
    if (payload.resources) {
      const resources = payload.resources;
      await applyToAll(resources, async (resource) => {
        const fetchedResource = await this.resourceService.get(resource);
        if (!fetchedResource) {
          throw new NotFoundError('RESOURCE.NON_EXISTANT_USER {{resource}}', {
            variables: { resource: `${resource}` },
          });
        }
        fetchedResources.push(fetchedResource);
      });
      wrappedInfustructure.resources.add(fetchedResources);
    }

    // check the existance of the parent
    let fetchedParent;
    if (payload.parent) {
      fetchedParent = await this.dao.get(payload.parent);
      if (!fetchedParent) {
        throw new NotFoundError('ORG.NON_EXISTANT_PARENT_ORG', { friendly: true });
      }
      wrappedInfustructure.parent = fetchedParent;
    }

    const createdInfustructure = await this.update(wrappedInfustructure);
    return createdInfustructure.id;
  }
}
