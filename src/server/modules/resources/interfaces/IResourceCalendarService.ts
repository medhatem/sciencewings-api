import { IBaseService } from '../../base/interfaces/IBaseService';
import { Result } from '@utils/Result';
import { ResourceCalendar } from '../../resources/models';
import { CreateResourceCalendarRO } from '../../resources/routes/RequestObject';

export abstract class IResourceCalendarService extends IBaseService<any> {
  createResourceCalendar: (payload: CreateResourceCalendarRO) => Promise<Result<ResourceCalendar>>;
}
