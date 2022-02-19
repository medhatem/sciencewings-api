import { Logger } from '@utils/Logger';
import { Resource } from '@/modules/resources/models/Resource';
import { ResourceCalendar } from '@/modules/resources/models/ResourceCalendar';
import { ResourceCalendarDao } from '@/modules/resources/daos/ResourceCalendarDAO';
import { ResourceDao } from '@/modules/resources/daos/ResourceDao';
import { connection } from '../db/index';
import { faker } from '@faker-js/faker';
import { provideSingleton } from '@/di';
import { wrap } from '@mikro-orm/core';
import { applyToAll } from '@/utils/utilities';

/**
 * create resource
 * by making for each one { ResourceCalendar }
 */
@provideSingleton()
export class SeedResources {
  constructor(private dao: ResourceDao, private calendarDAO: ResourceCalendarDao) {}

  async createResources(users: any, organizations: any) {
    try {
      const repository = connection.em.getRepository(Resource as any);
      await applyToAll(users, async (user: any, idx: number) => {
        const tz = faker.address.timeZone();
        const _calendar = wrap(new ResourceCalendar()).assign({
          name: faker.company.bsNoun(),
          timezone: tz,
        });
        _calendar.organization = organizations[idx];

        const calendar = await this.calendarDAO.create(_calendar);

        const res = {
          name: faker.company.bsNoun(),
          resourceType: 'resourceType',
          organization: organizations[idx],
          user: users[idx],
          timeEfficiency: faker.datatype.float(),
          calendar: calendar,
          timezone: tz,
          active: true,
        };

        const resource: any = repository.create(res);
        repository.persist(resource);
        return resource;
      });

      await repository.flush();

      return await this.dao.getAll();
    } catch (error) {
      Logger.getInstance().error(error);
      return null;
    }
  }
}
