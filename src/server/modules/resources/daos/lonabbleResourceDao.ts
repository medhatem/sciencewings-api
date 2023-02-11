import { lonabbleResource } from '@/modules/resources/models/lonabaleResources';
import { EntityManager, EntityRepository, QueryBuilder } from '@mikro-orm/postgresql';
import { GetRepository } from '@mikro-orm/core';

import { Logger } from '@/utils/Logger';
import { connection } from '@/db/index';
import { log } from '@/decorators/log';
import { container, provideSingleton } from '@/di/index';

@provideSingleton()
class lonabbleResourceRepository {
  public entitymanager: EntityManager;
  public repository: GetRepository<lonabbleResource, EntityRepository<lonabbleResource>>;
  public builder: QueryBuilder<lonabbleResource>;
  public logger: Logger;
  constructor(public model: lonabbleResource) {
    this.repository = (connection.em as any as EntityManager).getRepository<lonabbleResource>(
      model.constructor as new () => lonabbleResource,
    );
    this.logger = Logger.getInstance();
    this.entitymanager = connection.em as EntityManager;
  }

  static getInstance(): lonabbleResourceRepository {
    return container.get(lonabbleResourceRepository);
  }
  //   public async findAll(): Promise<lonabbleResource[]> {
  //     return this.em.find(lonabbleResource, {});
  //   }

  @log()
  public async getAll(): Promise<lonabbleResource[]> {
    this.logger.info(`${this.model.constructor.name}`);
    return (this.repository as any).findAll();
  }
}

let x = lonabbleResourceRepository.getInstance();
x.getAll();
