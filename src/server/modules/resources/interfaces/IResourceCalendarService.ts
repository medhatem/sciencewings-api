import { IBaseService } from '@modules/base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { ResourceCalendar } from '@modules/resources/models';
import { CreateResourceCalendarRO } from '@modules/resources/routes/RequestObject';

export abstract class IResourceCalendarService extends IBaseService<any> {
  createResourceCalendar: (payload: CreateResourceCalendarRO) => Promise<Result<ResourceCalendar>>;
}
