import { BaseService } from '@/modules/base/services/BaseService';
import { provideSingleton, container, lazyInject } from '@/di/index';
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
import { applyToAll, paginate } from '@/utils/utilities';
import { IMemberService } from '@/modules/hr/interfaces/IMemberService';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { FETCH_STRATEGY } from '@/modules/base/daos/BaseDao';
import { NotFoundError } from '@/Exceptions/NotFoundError';
import { ConflictError } from '@/Exceptions/ConflictError';
import { infrastructurelistline, subInfrasListLine } from '@/modules/infrastructure/infastructureTypes';
import { Member } from '@/modules/hr/models/Member';
import { Resource } from '@/modules/resources/models/Resource';
import { IResourceService } from '@/modules/resources/interfaces/IResourceService';
import { InfrastructuresList } from '@/types/types';

@provideSingleton(IInfrastructureService)
export class InfrastructureService extends BaseService<Infrastructure> implements IInfrastructureService {
  @lazyInject(IResourceService) public resourceService: IResourceService;

  constructor(
    public dao: infrastructureDAO,
    public organizationService: IOrganizationService,
    public memberService: IMemberService,
    public userService: IUserService,
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
  public async getAllOrganizationInfrastructures(orgId: number, page?: number, size?: number): Promise<any> {
    const organization = await this.organizationService.get(orgId);

    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
        variables: { org: `${orgId}` },
        friendly: true,
      });
    }

    const length = await this.dao.count({ organization });

    let infrastructures;

    if (page | size) {
      const skip = page * size;
      infrastructures = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL, {
        offset: skip,
        limit: size,
      })) as Infrastructure[];

      return paginate(infrastructures, page, size, skip, length);
    }

    infrastructures = await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL);

    return infrastructures;
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
        throw new NotFoundError('INFRA.NON_EXISTANT_PARENT_INFRA', { friendly: true });
      }
    }

    // check if the key is unique
    const keyExistingTest = await this.dao.getByCriteria({ key: payload.key });

    if (keyExistingTest) {
      throw new ConflictError('{{key}} ALREADY_EXISTS', { variables: { key: `${payload.key}` }, friendly: true });
    }

    const wrappedInfustructure = this.wrapEntity(Infrastructure.getInstance(), {
      name: payload.name,
      description: payload.description,
      key: payload.key,
      default: payload.default || false,
    });

    if (payload.default) {
      wrappedInfustructure.default = payload.default;
    }

    if (payload.responsible) {
      const user = await this.userService.get(payload.responsible);
      if (!user) {
        throw new NotFoundError('USER.NON_EXISTANT_DATA {{user}}', {
          variables: { user: `${payload.responsible}` },
          friendly: false,
        });
      }
      const responsable = (await this.memberService.getByCriteria(
        { user, organization },
        FETCH_STRATEGY.SINGLE,
      )) as Member;
      if (!responsable) {
        throw new NotFoundError('MEMBER.NON_EXISTANT_DATA {{member}}', {
          variables: { member: `${payload.responsible}` },
          friendly: false,
        });
      }
      wrappedInfustructure.responsible = responsable;
    }

    wrappedInfustructure.organization = organization;
    wrappedInfustructure.parent = fetchedParent;

    const createdInfustructure = await this.create(wrappedInfustructure);

    //TODO should create the ck permission's related to the created infrastructure .
    return createdInfustructure.id;
  }

  @log()
  public async getInfrastructureById(infraId: number): Promise<Infrastructure> {
    const infrastructure = await this.dao.get(infraId);
    if (!infrastructure) {
      throw new NotFoundError('INFRA.NON_EXISTANT_PARENT_INFRA', { friendly: true });
    }
    return infrastructure;
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
      throw new NotFoundError('INFRA.NON_EXISTANT_DATA {{infra}}', { variables: { infra: `${infraId}` } });
    }
    if (payload.key) {
      // check if the key is unique
      const keyExistingTest = await this.dao.getByCriteria({ key: payload.key });

      if (keyExistingTest) {
        throw new ConflictError('{{key}} ALREADY_EXISTS', { variables: { key: `${payload.key}` }, friendly: true });
      }
    }

    const wrappedInfustructure = this.wrapEntity(fetchedInfrastructure, {
      ...fetchedInfrastructure,
      name: payload.name || fetchedInfrastructure.name,
      description: payload.description || fetchedInfrastructure.description,
      key: payload.key || fetchedInfrastructure.key,
    });

    if (payload.responsible) {
      const [user, organization] = await Promise.all([
        this.organizationService.get(fetchedInfrastructure.organization.id),
        this.userService.get(payload.responsible),
      ]);
      if (!user) {
        throw new NotFoundError('USER.NON_EXISTANT_DATA {{user}}', {
          variables: { user: `${payload.responsible}` },
          friendly: false,
        });
      }
      if (!organization) {
        throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', {
          variables: { org: `${fetchedInfrastructure.organization.id}` },
          friendly: false,
        });
      }
      const responsable = await this.memberService.getByCriteria({ user, organization }, FETCH_STRATEGY.SINGLE);
      if (!responsable) {
        throw new NotFoundError('MEMBER.NON_EXISTANT_DATA {{member}}', {
          variables: { member: `${payload.responsible}` },
          friendly: false,
        });
      }
      wrappedInfustructure.responsible = responsable;
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

  @log()
  public async prepareInfrastrustructuresList(
    fetchedInfrastructure: Infrastructure[],
  ): Promise<infrastructurelistline[]> {
    const InfrastructureList: infrastructurelistline[] = [];
    let subInfras: any[] = [];
    let responsible: Member;
    await applyToAll(fetchedInfrastructure, async (infrastructure) => {
      responsible = infrastructure.responsible;
      await infrastructure.children.init();
      subInfras = infrastructure.children.toArray();
      const resourceNb = await infrastructure.resources.loadCount(true);
      InfrastructureList.push({
        name: infrastructure.name,
        key: infrastructure.key,
        responsible: responsible,
        resourcesNb: resourceNb,
        id: infrastructure.id,
        subInfrastructure: subInfras,
      });
    });
    return InfrastructureList;
  }

  /**
   * get the list of infrustructure of a given organization
   * @param orgId: organization id
   */
  @log()
  public async getAllInfrastructuresOfAgivenOrganization(
    orgId: number,
    page?: number,
    size?: number,
    query?: string,
  ): Promise<InfrastructuresList> {
    const organization = await this.organizationService.get(orgId);
    if (!organization) {
      throw new NotFoundError('ORG.NON_EXISTANT_DATA {{org}}', { variables: { org: `${orgId} ` } });
    }

    const length = await this.dao.count({ organization });

    let infrastructures;

    if (page | size) {
      const skip = page * size;
      if (query) {
        infrastructures = (await this.dao.getByCriteria(
          { organization, name: { $like: '%' + query + '%' } },
          FETCH_STRATEGY.ALL,
          {
            offset: skip,
            limit: size,
          },
        )) as Infrastructure[];
      } else {
        infrastructures = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL, {
          offset: skip,
          limit: size,
        })) as Infrastructure[];
      }

      const result = paginate(infrastructures, page, size, skip, length);

      const paginatedDataList = await this.prepareInfrastrustructuresList(result.data);
      const paginatedResult: InfrastructuresList = {
        data: paginatedDataList,
        pagination: result.pagination,
      };
      return paginatedResult;
    }

    infrastructures = (await this.dao.getByCriteria({ organization }, FETCH_STRATEGY.ALL)) as Infrastructure[];
    infrastructures = await this.prepareInfrastrustructuresList(infrastructures);
    const result: InfrastructuresList = {
      data: infrastructures,
    };
    return result;
  }

  /**
   * add a resource to a given infrastructure
   * @param resourceId: resource id
   * @param infrastructureId: infrastructure id
   */

  @log()
  public async addResourceToInfrastructure(resourceId: number, infrastructureId: number): Promise<number> {
    const [fetchedInfrastructure, fetchedResource] = await Promise.all([
      this.dao.get(infrastructureId),
      this.resourceService.get(resourceId),
    ]);
    if (!fetchedInfrastructure) {
      throw new NotFoundError('INFRA.NON_EXISTANT_DATA {{infra}}', { variables: { infra: `${infrastructureId}` } });
    }

    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT_USER {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    await fetchedInfrastructure.resources.init();
    fetchedInfrastructure.resources.add(fetchedResource);
    this.dao.update(fetchedInfrastructure);
    return infrastructureId;
  }
  /**
   * delete a resource from a given infrastructure
   * @param resourceId: resource id
   * @param infrastructureId: infrastructure id
   */
  @log()
  public async deleteResourceFromGivenInfrastructure(resourceId: number, infrastructureId: number): Promise<number> {
    const [fetchedInfrastructure, fetchedResource] = await Promise.all([
      this.dao.get(infrastructureId),
      this.resourceService.get(resourceId),
    ]);

    if (!fetchedInfrastructure) {
      throw new NotFoundError('INFRA.NON_EXISTANT_DATA {{infra}}', { variables: { infra: `${infrastructureId}` } });
    }

    if (!fetchedResource) {
      throw new NotFoundError('RESOURCE.NON_EXISTANT_USER {{resource}}', {
        variables: { resource: `${resourceId}` },
      });
    }

    await fetchedInfrastructure.resources.init();
    fetchedInfrastructure.resources.remove(fetchedResource);
    this.dao.update(fetchedInfrastructure);
    return infrastructureId;
  }

  /**
   * get all resources of a given infrastructure
   * @param infrastructureId: infrastructure id
   */
  @log()
  public async getAllResourcesOfAGivenInfrastructure(infrastructureId: number): Promise<Resource[]> {
    const fetchedInfrastructure = await this.dao.get(infrastructureId);
    if (!fetchedInfrastructure) {
      throw new NotFoundError('INFRA.NON_EXISTANT_DATA {{infra}}', { variables: { infra: `${infrastructureId}` } });
    }
    let resources: any[] = [];
    await fetchedInfrastructure.resources.init();
    resources = fetchedInfrastructure.resources.toArray();
    return resources;
  }

  /**
   * get all sub infrastructures of a given infrastructure
   * @param infrastructureId: infrastructure id
   */
  @log()
  public async getAllSubInfasOfAGivenInfrastructure(infrastructureId: number): Promise<subInfrasListLine[]> {
    const fetchedInfrastructure = await this.dao.get(infrastructureId);
    if (!fetchedInfrastructure) {
      throw new NotFoundError('INFRA.NON_EXISTANT_DATA {{infra}}', { variables: { infra: `${infrastructureId}` } });
    }

    const subInfras = (await this.dao.getByCriteria(
      { parent: fetchedInfrastructure },
      FETCH_STRATEGY.ALL,
    )) as Infrastructure[];

    const subInfrasDetailsList: subInfrasListLine[] = [];
    await applyToAll(subInfras, async (infrastructure) => {
      await infrastructure.resources.init();
      const resourceNb = await infrastructure.resources.loadCount(true);
      subInfrasDetailsList.push({
        subInfrastructure: infrastructure,
        resourcesNb: resourceNb,
      });
    });
    return subInfrasDetailsList;
  }
}
